package api

import "github.com/gin-gonic/gin"

// @Summary 把問題傳給 ChatGPT 並取得回答
// @Description 接收到問題後，加入特定的 Header 以及格式，然後傳給 ChatGPT 進行回答。
// @Description 最後再轉成 JSON 格式回傳。
// @Tags		api
// @schemes		http
// @Produce		json
// @Success		200	{object} api_model.RespChat	"答案"
// @Router		/api/images/generations [post]
func Text2Image(c *gin.Context) {}
