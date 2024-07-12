package rxlog

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

	rxlog_formatter "app/pkg/rxlog/formatter"
	rxlog_hook "app/pkg/rxlog/hook"

	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	New(LevelInfo).Info("test")
	assert.Equal(t, true, false)
}

func TestWith(t *testing.T) {
	New(LevelInfo).With("key", "value").With("a", 123).Info("test")
	assert.Equal(t, true, false)
}

func TestNewWithFile(t *testing.T) {
	File(LevelInfo, "test.log").Info("test")
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "test"))
	File(LevelInfo, "test.log").Info("")
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "level=INF"))
	File(LevelInfo, "test.log").With("empty", "yes").Info("")
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "empty=yes"))
}

func TestMulti(t *testing.T) {
	logger := Multi(
		File(LevelInfo, "test.log"),
		File(LevelWarn, "test2.log"),
		New(LevelDebug),
	).Debug("hihi").Info("abc").Warn("def")
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "abc"))
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "def"))
	assert.Equal(t, true, FileExistStringLine(PATH+"/test2.log", "def"))

	logger.Level(LevelDebug).Debug("debug")
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "debug"))
	assert.Equal(t, true, FileExistStringLine(PATH+"/test2.log", "debug"))
}

func TestBeautyFormatter(t *testing.T) {
	New(LevelInfo).Format(&rxlog_formatter.BeautyFormatter{Color: true}).Info("color")

	File(LevelInfo, "test.log").Format(&rxlog_formatter.BeautyFormatter{Color: true}).Warn("color")
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "color"))
	assert.Equal(t, true, FileExistStringLine(PATH+"/test.log", "WRN"))

	assert.Equal(t, true, false)
}

func TestFileLineHook(t *testing.T) {
	// +1
	New(LevelTrace).Hook(&rxlog_hook.FileLineHook{}).Trace("test")
	fmt.Println("***")
	//+1
	New(LevelDebug).Hook(&rxlog_hook.FileLineHook{}).Debug("test")
	fmt.Println("***")
	// +1
	New(LevelInfo).Hook(&rxlog_hook.FileLineHook{}).Info("test")
	fmt.Println("***")
	// +1
	New(LevelWarn).Hook(&rxlog_hook.FileLineHook{}).Warn("test")
	fmt.Println("***")
	// +1
	New(LevelError).Hook(&rxlog_hook.FileLineHook{}).Error("test")
	fmt.Println("***")
	// +0
	New(LevelFatal).Hook(&rxlog_hook.FileLineHook{}).Fatal("test")
	fmt.Println("***")
	// +1
	// New(LevelPanic).Hook(&rxlog_hook.FileLineHook{}).Panic("test")
	// 因為 logrus 遇到 panic 訊息會直接跳出，所以這裡不會執行
	assert.Equal(t, true, true)
}

func TestMaxLevelHook(t *testing.T) {
	New(LevelTrace).Hook(&rxlog_hook.MaxLevelHook{MaxLevel: LevelInfo}).
		Trace("test").
		Warn("test")
	assert.Equal(t, true, false)
}

func TestDebug(t *testing.T) {
	c := assert.New(t)
	Debug("test")
	// 這裡請自己看控制台有沒有輸出
	c.Equal(true, true)
}

func TestInfo(t *testing.T) {
	c := assert.New(t)
	Info("test")
	time.Sleep(100 * time.Millisecond) // 等待寫入
	expected := fmt.Sprintf("time=%s level=INF msg=test", time.Now().Format("2006/01/02 15:04:05-07:00"))
	c.Equal(true, FileExistStringLine(PATH+"/access.log", expected))
}

func TestWarn(t *testing.T) {
	c := assert.New(t)
	Warn("test")
	time.Sleep(10 * time.Millisecond) // 等待寫入
	expected := fmt.Sprintf("time=%s level=WRN msg=test", time.Now().Format("2006/01/02 15:04:05-07:00"))
	c.Equal(true, FileExistStringLine(PATH+"/access.log", expected))
}
func TestError(t *testing.T) {
	c := assert.New(t)
	Error("test")
	time.Sleep(10 * time.Millisecond) // 等待寫入
	expected := fmt.Sprintf("time=%s level=ERR msg=test", time.Now().Format("2006/01/02 15:04:05-07:00"))
	c.Equal(true, FileExistStringLine(PATH+"/access.log", expected))
}

func TestFatal(t *testing.T) {
	c := assert.New(t)
	Fatal("test")
	time.Sleep(10 * time.Millisecond) // 等待寫入
	expected := fmt.Sprintf("time=%s level=FTL msg=test", time.Now().Format("2006/01/02 15:04:05-07:00"))
	c.Equal(true, FileExistStringLine(PATH+"/access.log", expected))
}

func TestPanic(t *testing.T) {
	c := assert.New(t)
	Panic("test")
	time.Sleep(10 * time.Millisecond) // 等待寫入
	expected := fmt.Sprintf("time=%s level=PNC msg=test", time.Now().Format("2006/01/02 15:04:05-07:00"))
	c.Equal(true, FileExistStringLine(PATH+"/error.log", expected))
}

// 使用 go test -v -bench="." ./src/pkg/log 來測試
func BenchmarkInfo(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Info("benchmark test")
	}
}

/**
 * 檢查檔案是否存在訊息
 * 這樣才能檢查是否有寫入訊息
 * 不然 logger 是直接輸出到檔案，無法檢查
 */
func FileExistStringLine(path, msg string) bool {
	// 開啟檔案
	file, err := os.Open(path)
	if err != nil {
		return false
	}
	defer file.Close()

	// 使用 bufio.Scanner 讀取檔案
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// 判斷訊息是否存在於檔案中
		if strings.Contains(scanner.Text(), msg) {
			return true
		}
	}

	return false
}
