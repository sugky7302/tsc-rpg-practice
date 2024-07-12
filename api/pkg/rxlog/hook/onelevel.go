package rxlog_hook

import (
	"app/pkg/rxlog/logrus"
)

// SpecifiedLevelHook 是指定輸出等級的 logrus.Hook，
// 只有輸出等級為該等級時才會輸出。
// 用法非常簡單，只要在 logrus 實例中加入這個 Hook 就可以了。
type SpecifiedLevelHook struct {
	Level logrus.Level
}

func (hook *SpecifiedLevelHook) Fire(entry *logrus.Entry) error {
	// 因為 Data 跟 Message 都沒有值才不會輸出，所以兩個都要清空。
	if entry.Level != hook.Level {
		entry.Message = ""
		entry.Data = make(logrus.Fields)
	}
	return nil
}

func (hook *SpecifiedLevelHook) Levels() []logrus.Level {
	return logrus.AllLevels
}
