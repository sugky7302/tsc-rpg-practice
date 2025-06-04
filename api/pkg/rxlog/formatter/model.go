package rxlog_formatter

import "app/pkg/rxlog/logrus"

// 因為 logrus 的 Formatter 只能定義一個，所以這邊用介面來實現。
type Formatter interface {
	Format(*logrus.Entry) *logrus.Entry
}
