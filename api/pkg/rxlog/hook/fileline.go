package rxlog_hook

import (
	"os"
	"runtime"
	"strings"

	"app/pkg/rxlog/logrus"
)

// FileLineHook 是專門用來記錄呼叫函數的檔案名稱與行數的 logrus.Hook，
// 這樣就可以在 logrus 的輸出中看到呼叫函數的檔案名稱與行數。
// 用法非常簡單，只要在 logrus 實例中加入這個 Hook 就可以了。
type FileLineHook struct{}

func (hook *FileLineHook) Fire(entry *logrus.Entry) error {
	file, line := getCaller(entry.Level)
	entry.SetData("filepath", strings.Replace(file, os.Getenv("GO_PROJ_PATH")+"/", "", 1))
	entry.SetData("linenumber", line)
	return nil
}

// getCaller 是為了找出實際呼叫 logrus 函數的檔案名稱與行數。
// 因為每次呼叫時，其層數都會不一樣，所以要一層一層找。
// 這裡是從第 9 層開始找是因為 Fatal 的層數是 9，其他都是 10。
func getCaller(level logrus.Level) (string, int) {
	var idx int
	if level == logrus.FatalLevel {
		idx = 9
	} else {
		idx = 10
	}

	_, file, line, ok := runtime.Caller(idx)
	if ok {
		return file, line
	} else {
		return "", 0
	}
}

func (hook *FileLineHook) Levels() []logrus.Level {
	return logrus.AllLevels
}
