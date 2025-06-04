package rxlog_hook

import (
	"app/pkg/rxlog/logrus"
)

// MaxLevelHook 是用來限制輸出等級的 logrus.Hook，
// 如果輸出等級高於設定的等級，就不會輸出。
// 用法非常簡單，只要在 logrus 實例中加入這個 Hook 就可以了。
type MaxLevelHook struct {
	MaxLevel logrus.Level
}

func (hook *MaxLevelHook) Fire(entry *logrus.Entry) error {
	// 因為 logrus.Level 從大到小是 Trace -> Debug -> Info ...
	// 所以這邊的符號是 <= 而不是 >=
	// 因為 Data 跟 Message 都沒有值才不會輸出，所以兩個都要清空。
	if entry.Level < hook.MaxLevel {
		entry.Message = ""
		entry.Data = make(logrus.Fields)
	}
	return nil
}

func (hook *MaxLevelHook) Levels() []logrus.Level {
	return logrus.AllLevels
}
