package api

import (
	"github.com/gin-gonic/gin"
)

func RegisterSubRouter(g *gin.RouterGroup) {
	// 這裡的 SSE 是一個中間件，把 Content-Type 設定成 text/event-stream，這樣就可以用 SSE 來傳送資料。
	// g.POST("/api/chat", api_middleware.SSE(), Chat)
	// g.POST("/chat/completions", api_middleware.SSE(), Chat)
}
