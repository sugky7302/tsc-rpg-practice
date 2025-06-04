package api_middleware

import (
	"app/pkg/rxlog"
	"fmt"
	"time"

	"app/pkg/rxlog/logrus"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
)

var logger = rxlog.Multi(
	rxlog.New(rxlog.LevelInfo).
		Format(&GinFormatter{}),
	rxlog.File(rxlog.LevelInfo, "access.log"),
)

// GinFormatter 是把 with 的資料整合成一行的格式。
type GinFormatter struct{}

func (m *GinFormatter) Format(entry *logrus.Entry) *logrus.Entry {
	timestamp := entry.Time.Format("2006/01/02 15:04:05")
	entry.Message = fmt.Sprintf("[%s] %s | %13v | %15s | %8s %s",
		timestamp,
		colorizeStatus(entry.Data["status"].(int)),
		entry.Data["latency"],
		entry.Data["clientIP"],
		entry.Data["method"],
		entry.Data["url"],
	)
	entry.Data = make(map[string]interface{})

	return entry
}

func colorizeStatus(status int) string {
	switch {
	case status >= 200 && status < 300:
		return color.GreenString(fmt.Sprint(status))
	case status >= 300 && status < 400:
		return color.YellowString(fmt.Sprint(status))
	case status >= 400 && status < 600:
		return color.RedString(fmt.Sprint(status))
	default:
		return fmt.Sprint(status)
	}
}

func LoggerToFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()
		c.Next()

		endTime := time.Now()
		latencyTime := endTime.Sub(startTime)
		reqMethod := c.Request.Method
		// 原本這裡是用 RequestURI，但是 routers/main_test.TestGinLog 會讀不到網址，
		// 所以改成讀取 URL。
		// Arvin Yang - 2023/06/16
		URL := c.Request.URL.String()
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		logger.With("status", statusCode).
			With("latency", latencyTime).
			With("clientIP", clientIP).
			With("method", reqMethod).
			With("url", URL).Info("")
	}
}
