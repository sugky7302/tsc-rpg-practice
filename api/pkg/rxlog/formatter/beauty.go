package rxlog_formatter

import (
	util "app/pkg/rxlog/util"
	"fmt"

	"app/pkg/rxlog/logrus"

	"github.com/fatih/color"
)

type BeautyFormatter struct {
	// ! 不建議 File 開啟 Color，因為檔案不會有顏色
	Color bool
}

// Format 實作 logrus.Formatter 介面
// entry.Level 是 logrus 允許輸出的最低等級，不是實際呼叫函數的等級，所以這裡不會用它
// entry.Message 包含了時間、等級、訊息。這裡需要等級 & 訊息，所以要用正規表達式取出它們
func (f *BeautyFormatter) Format(entry *logrus.Entry) *logrus.Entry {
	if entry.Message == "" {
		return entry
	}

	timestamp := entry.Time.Format("2006/01/02 15:04:05")
	fields := util.Fields2Str(entry.Dup().Data, []string{"filepath", "linenumber"})
	// 用 entry.HasCaller() 無法判斷是否有使用 FilelineHook
	// 所以這裡就直接判斷 filepath 跟 linenumber 是否有值
	if entry.GetData("filepath") != nil || entry.GetData("linenumber") != nil {
		if f.Color {
			entry.Message = fmt.Sprintf("[%s] %s <%s:%d> %s%s",
				timestamp,
				colorizeLevel(entry.Level),
				entry.GetData("filepath"),
				entry.GetData("linenumber"),
				entry.Message,
				fields)
		} else {
			entry.Message = fmt.Sprintf("[%s] %s <%s:%d> %s%s",
				timestamp,
				GetLevelStr(entry.Level),
				entry.GetData("filepath"),
				entry.GetData("linenumber"),
				entry.Message,
				fields)
		}
	} else {
		if f.Color {
			entry.Message = fmt.Sprintf("[%s] %s %s%s",
				timestamp,
				colorizeLevel(entry.Level),
				entry.Message,
				fields)
		} else {
			entry.Message = fmt.Sprintf(
				"[%s] %s %s%s",
				timestamp,
				GetLevelStr(entry.Level),
				entry.Message,
				fields)
		}
	}

	return entry
}

func colorizeLevel(level logrus.Level) string {
	// this whole mess of dealing with ansi color codes is required if you want the colored output
	//otherwise you will lose colors in the log levels
	switch level {
	case logrus.DebugLevel, logrus.TraceLevel:
		return color.BlueString(GetLevelStr(level))
	case logrus.InfoLevel:
		return color.GreenString(GetLevelStr(level))
	case logrus.WarnLevel:
		return color.YellowString(GetLevelStr(level))
	case logrus.ErrorLevel, logrus.FatalLevel, logrus.PanicLevel:
		return color.RedString(GetLevelStr(level))
	default:
		return GetLevelStr(level)
	}

}

func GetLevelStr(level logrus.Level) string {
	switch level {
	case logrus.TraceLevel:
		return "TRC"
	case logrus.DebugLevel:
		return "DBG"
	case logrus.InfoLevel:
		return "INF"
	case logrus.WarnLevel:
		return "WRN"
	case logrus.ErrorLevel:
		return "ERR"
	case logrus.FatalLevel:
		return "FTL"
	case logrus.PanicLevel:
		return "PNC"
	default:
		return "???"
	}
}
