package rxlog

import (
	rxlog_formatter "app/pkg/rxlog/formatter"
	rxlog_util "app/pkg/rxlog/util"
	"bytes"
	"fmt"
	"io"
	"os"
	"runtime"
	"time"

	"app/pkg/rxlog/logrus"
	"app/pkg/rxlog/lumberjack"
)

var (
	LevelTrace = logrus.TraceLevel
	LevelDebug = logrus.DebugLevel
	LevelInfo  = logrus.InfoLevel
	LevelWarn  = logrus.WarnLevel
	LevelError = logrus.ErrorLevel
	LevelFatal = logrus.FatalLevel
	LevelPanic = logrus.PanicLevel
	// 記錄檔案日誌的設定，防止重複開啟檔案。
	fileLoggers = make(map[string]*lumberjack.Logger)
)

// FormatterRunner 是為了解決直接執行自己的 formatter 會抓不到 entry.Message 的問題
// 以及無法在 logrus 執行自己的 formatter 的問題。
type FormatterRunner struct {
	logger *Logger
}

// Format 實作 logrus.Formatter 介面
// entry.Level 是 logrus 允許輸出的最低等級，不是實際呼叫函數的等級，所以這裡不會用它
// entry.Message 包含了時間、等級、訊息。這裡需要等級 & 訊息，所以要用正規表達式取出它們
func (m *FormatterRunner) Format(entry *logrus.Entry) ([]byte, error) {
	var b *bytes.Buffer
	if entry.Buffer != nil {
		b = entry.Buffer
	} else {
		b = &bytes.Buffer{}
	}

	// 這裡要用複製的方式，不然會產生 fatal error: concurrent map iteration and map write
	dataStr := rxlog_util.Fields2Str(entry.Dup().Data, nil)

	if m.logger.formatters != nil && len(m.logger.formatters) > 0 {
		for _, formatter := range m.logger.formatters {
			entry = formatter.Format(entry)
		}
	} else if entry.Message != "" {
		entry.Message = fmt.Sprintf(
			"time=%s level=%s msg=%s%s",
			entry.Time.Format("2006/01/02 15:04:05-07:00"),
			rxlog_formatter.GetLevelStr(entry.Level),
			entry.Message,
			dataStr,
		)
	} else if entry.Message == "" && dataStr != "" {
		entry.Message = fmt.Sprintf(
			"time=%s level=%s%s",
			entry.Time.Format("2006/01/02 15:04:05-07:00"),
			rxlog_formatter.GetLevelStr(entry.Level),
			dataStr,
		)
	}

	if entry.Message == "" {
		b.WriteString("")
	} else {
		b.WriteString(entry.Message + "\n")
	}

	return b.Bytes(), nil
}

// Logger 遵循 logrus.Logger 的介面，並採用 ReactiveX 原則設計，達到更好的可測試性和擴充性。
// 除此之外，為了可以同時輸出，Logger 加入 children 的概念，可以同時輸出到多個地方。
type Logger struct {
	// logrus 實例
	entry *logrus.Entry
	// 使用自己的 formatter 來規避 logrus 只能使用一個 formatter 的限制。
	formatters []rxlog_formatter.Formatter
	// 子 Logger
	children []*Logger
}

// release 會釋放 entry，避免重複使用。
func (m *Logger) release() {
	logger := m.entry.Logger
	m.entry = logrus.NewEntry(logger)
}

func (m *Logger) Add(child *Logger) *Logger {
	if m.children == nil {
		m.children = make([]*Logger, 0)
	}

	m.children = append(m.children, child)
	return m
}

// 只有最後一個生效。
func (m *Logger) Level(level logrus.Level) *Logger {
	if m.entry != nil {
		m.entry.Logger.SetLevel(level)
	}

	for _, child := range m.children {
		child.Level(level)
	}

	return m
}

// Format 除了會加入自己的 formatter 之外，也會把 Runner 綁定到 entry 上。
// 不然自訂的 formatter 會抓不到 entry.Message。
func (m *Logger) Format(formatter rxlog_formatter.Formatter) *Logger {
	if m.formatters == nil {
		m.formatters = make([]rxlog_formatter.Formatter, 0)
	}

	m.formatters = append(m.formatters, formatter)

	for _, child := range m.children {
		child.Format(formatter)
	}

	return m
}

func (m *Logger) Hook(hook logrus.Hook) *Logger {
	if m.entry != nil {
		m.entry.Logger.AddHook(hook)
	}

	for _, child := range m.children {
		child.Hook(hook)
	}

	return m
}

// Output 設定輸出的地方，可以是檔案、標準輸出、標準錯誤輸出等等。
// 只有最後一個生效。
func (m *Logger) Output(output io.Writer) *Logger {
	if m.entry != nil {
		m.entry.Logger.SetOutput(output)
	}
	return m
}

// OutputFile 是為了簡化檔案輸出的設定。
// 只有最後一個生效。
func (m *Logger) OutputFile(filename string, maxSize int, maxBackups int, maxAge int) *Logger {
	if m.entry != nil {
		if _, ok := fileLoggers[filename]; !ok {
			fileLoggers[filename] = &lumberjack.Logger{
				Filename:   PATH + "/" + filename,
				MaxSize:    maxSize,    // 最大檔案大小，單位是 MB
				MaxBackups: maxBackups, // 最多保留幾個檔案
				MaxAge:     maxAge,     // 最多保留幾天
				Compress:   true,       // disabled by default
				LocalTime:  true,
			}
		}

		m.entry.Logger.SetOutput(fileLoggers[filename])
	}
	return m
}

// With 是為了方便在日誌中加入額外的資訊。
// 禁止使用 filepath 和 linenumber 這兩個 key，因為這兩個 key 是由 FileLineHook 自動加入的。
// 這裡一定要更新 entry，不然會沒有效果。
func (m *Logger) With(key string, value any) *Logger {
	if m.entry != nil {
		m.entry.SetData(key, value)
	}

	for _, child := range m.children {
		child.With(key, value)
	}

	return m
}

// Trace 用來補足 Warn 或 Error 的不足。
// 例如：
//  1. 使用者目前是進行什麼功能的操作
//  2. 使用者目前操作的步驟流程
func (m *Logger) Trace(msg string, args ...any) *Logger {
	if m.entry != nil {
		m.entry.Tracef(msg, args...)
		m.release()
	}

	for _, child := range m.children {
		child.Trace(msg, args...)
	}

	return m
}

// Debug 提供詳細的系統狀態，讓開發者或者其他了解這套系統的人員能夠釐清問題。
func (m *Logger) Debug(msg string, args ...any) *Logger {
	if m.entry != nil {
		m.entry.Debugf(msg, args...)
		m.release()
	}

	for _, child := range m.children {
		child.Debug(msg, args...)
	}

	return m
}

// Info 提供關鍵的狀態供維護人員快速判斷系統狀態。
func (m *Logger) Info(msg string, args ...any) *Logger {
	if m.entry != nil {
		m.entry.Infof(msg, args...)
		m.release()
	}

	for _, child := range m.children {
		child.Info(msg, args...)
	}

	return m
}

// Warn 是潛在性錯誤或者提示，不會導致程式無法繼續執行。
// 例如：
//  1. 網路暫時中斷
//  2. 轉換的型態可能造成資料遺失
//  3. 定時執行的任務失敗
func (m *Logger) Warn(msg string, args ...any) *Logger {
	if m.entry != nil {
		m.entry.Warnf(msg, args...)
		m.release()
	}

	for _, child := range m.children {
		child.Warn(msg, args...)
	}

	return m
}

// Error 是一般錯誤，不會導致程式無法繼續執行。
// 例如：
// 1. 網路連線無預期中斷且無法連回
// 2. 傳輸資料失敗
// 3. CRUD database 失敗
// 4. 諸如此類會影響功能的錯誤
func (m *Logger) Error(msg string, args ...any) *Logger {
	if m.entry != nil {
		m.entry.Errorf(msg, args...)
		m.release()
	}

	for _, child := range m.children {
		child.Error(msg, args...)
	}

	return m
}

// Fatal 是嚴重到會影響程式執行的錯誤。
func (m *Logger) Fatal(msg string, args ...any) *Logger {
	if m.entry != nil {
		m.entry.Logf(LevelFatal, msg, args...)
		m.release()
	}

	for _, child := range m.children {
		child.Fatal(msg, args...)
	}

	return m
}

var stdErrFile = PATH + "/error.log"
var stdErrFileHandler *os.File // 加入引用，避免被 GC 回收

// logrus 執行 Panic 時，內建跳出程式，只有該錯誤會導致程式無法繼續執行時才使用。
// 可以代替 panic(...)
// Golang Panic 只會寫入標準錯誤輸出，為了可以輸出到檔案，必須調用函數。
// 參考：https://zhuanlan.zhihu.com/p/245369778
func (m *Logger) Panic(msg string, args ...any) *Logger {
	if m.entry != nil {
		RewriteStderrFile()

		// 因為 Logf 之後就抓不到 entry.Message 了，所以這裡模擬 entry.go/write() 的行為
		// 先把 time、level 和 message 設定好，
		m.entry.Time = time.Now()
		m.entry.Level = LevelPanic
		m.entry.Message = fmt.Sprintf(msg, args...)

		// 然後再用 formatter 轉換成 []byte
		var res string

		if serialized, err := m.entry.Logger.Formatter.Format(m.entry); err != nil {
			res = fmt.Sprintf("Failed to obtain reader, %v\n", err)
		} else {
			res = string(serialized)
		}

		// 手動寫入檔案
		// 因為 panic 不會換行，這會導致寫入檔案的訊息會跟在上一行的後面，所以要先換行。
		if stat, e := stdErrFileHandler.Stat(); e == nil && stat.Size() == 0 {
			stdErrFileHandler.WriteString("!! Please select UTF-8 encoding to read this file\n\n")
		} else if e == nil && stat.Size() > 0 {
			stdErrFileHandler.WriteString("\n\n")
		}
		stdErrFileHandler.WriteString(res)
		// 執行 panic
		m.entry.Logf(LevelPanic, msg, args...)
	}

	for _, child := range m.children {
		child.Panic(msg, args...)
	}

	return m
}

func RewriteStderrFile() error {
	if runtime.GOOS == "windows" {
		return nil
	}

	file, err := os.OpenFile(stdErrFile, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		return err
	}
	defer file.Close()
	stdErrFileHandler = file //把文件句柄保存到全局变量，避免被GC回收

	// if err1 := RedirectStderrForUnix(file); err1 != nil {
	// 	return err1
	// }

	// 内存回收前关闭文件描述符
	runtime.SetFinalizer(stdErrFileHandler, func(fd *os.File) {
		fd.Close()
	})

	return nil
}
