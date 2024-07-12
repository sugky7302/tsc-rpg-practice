package rxlog

import (
	rxlog_formatter "app/pkg/rxlog/formatter"
	rxlog_hook "app/pkg/rxlog/hook"
	"os"

	"app/pkg/rxlog/logrus"
)

var (
	PATH   string
	logger *Logger
)

func init() {
	if dir, err := os.Getwd(); err != nil {
		PATH = "./log"
	} else {
		PATH = dir + "/log"
	}

	if err := os.MkdirAll(PATH, 0755); err != nil {
		panic("無法建立 log 資料夾: " + err.Error())
	}

	var level logrus.Level
	if os.Getenv("GIN_MODE") == "release" {
		level = LevelInfo
	} else {
		level = LevelDebug
	}

	logger = Multi(
		New(level).Format(&rxlog_formatter.BeautyFormatter{Color: true}),
		File(level, "access.log"),
		// 只記錄 Trace 等級的 log，用於追蹤程式執行過程。
		// 因為 FileLine 會把 file 跟 line 寫入 entry.Data
		// 所以必須要在 SpecifiedLevel 之前，不然 SpecifiedLevel 把 entry.Data 清空後又添加，
		// FormatterRunner 就會把 file 跟 line 寫入 entry.Message，導致 trace.log 還是有訊息。
		// Arvin Yang - 2024/01/23
		File(LevelTrace, "trace.log").
			Hook(&rxlog_hook.FileLineHook{}).
			Hook(&rxlog_hook.SpecifiedLevelHook{Level: LevelTrace}),
	)
}

func Multi(loggers ...*Logger) *Logger {
	return &Logger{
		children: loggers,
	}
}

// New 會生成一個新的 Logger 實例。
func New(level logrus.Level) *Logger {
	instance := logrus.New()
	// 讓 logrus 可以記錄呼叫函數的檔案名稱、行數、With 的值。
	// 在 FileLineHook 中，entry.Logger.SetReportCaller(true) 會造成程式卡住，
	// 所以這邊就把它放在這裡。 - Arvin Yang - 2024/03/02
	instance.SetReportCaller(true)

	logger := (&Logger{
		formatters: []rxlog_formatter.Formatter{},
		entry:      logrus.NewEntry(instance),
	}).Level(level)

	logger.entry.Logger.SetFormatter(&FormatterRunner{logger: logger})
	logger.Output(os.Stdout)
	return logger
}

func File(level logrus.Level, filename string, args ...int) *Logger {
	var (
		maxSize    = 10
		maxBackups = 14
		maxAge     = 28
	)

	if len(args) > 0 {
		maxSize = args[0]
	}

	if len(args) > 1 {
		maxBackups = args[1]
	}

	if len(args) > 2 {
		maxAge = args[2]
	}

	return New(level).OutputFile(filename, maxSize, maxBackups, maxAge)
}

// 為了方便使用，這裡提供了一些快捷函數。
func Trace(msg string, args ...any) {
	logger.Trace(msg, args...)
}

func Debug(msg string, args ...any) {
	logger.Debug(msg, args...)
}

func Info(msg string, args ...any) *Logger {
	return logger.Info(msg, args...)
}

func Warn(msg string, args ...any) *Logger {
	return logger.Warn(msg, args...)
}

func Error(msg string, args ...any) *Logger {
	return logger.Error(msg, args...)
}

func Fatal(msg string, args ...any) *Logger {
	return logger.Fatal(msg, args...)
}

func Panic(msg string, args ...any) {
	logger.Panic(msg, args...)
}

func With(key string, value any) *Logger {
	return logger.With(key, value)
}
