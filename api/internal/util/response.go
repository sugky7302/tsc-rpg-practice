// 這裡放置一些常用的回應函式
// 把 message 標準化
package api_util

import (
	log "app/pkg/rxlog"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Created 是回應新增成功。
func Created(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{
		"message": "Created Successfully",
		"error":   "",
	})
}

// Updated 是回應更新成功。
func Updated(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Updated Successfully",
		"error":   "",
	})
}

// Deleted 是回應刪除成功。
func Deleted(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Deleted Successfully",
		"error":   "",
	})
}

// BadRequest 是回應參數錯誤。
func BadRequest(c *gin.Context, s ...string) {
	e := getStringOrDefault(s, "參數錯誤")
	log.With("error", e).Trace(c.Request.URL.Path + " 出現 Bad Request 錯誤。")
	c.JSON(http.StatusBadRequest, gin.H{
		"message": "Bad Request",
		"error":   e,
	})
}

// Unauthorized 是回應認證錯誤。
func Unauthorized(c *gin.Context, s ...string) {
	e := getStringOrDefault(s, "認證失敗，請重新確認 token 是否正確。")
	log.With("error", e).Trace(c.Request.URL.Path + " 出現 Unauthorized 錯誤。")
	c.JSON(http.StatusUnauthorized, gin.H{
		"message": "Unauthorized",
		"error":   e,
	})
}

// NoContent 是回應空內容。
func NoContent(c *gin.Context) {
	log.Trace(c.Request.URL.Path + " 沒有搜索到資料。")
	c.JSON(http.StatusNoContent, gin.H{
		"message": "No Content",
		"error":   "查無資料。",
	})
}

// InternalServerError 是回應伺服器錯誤。
func InternalServerError(c *gin.Context, s ...string) {
	e := getStringOrDefault(s, "伺服器錯誤")
	log.With("error", e).Trace(c.Request.URL.Path + " 出現 Internal Server Error 錯誤。")
	c.JSON(http.StatusInternalServerError, gin.H{
		"message": "Internal Server Error",
		"error":   e,
	})
}

// Forbidden 是回應權限錯誤。
func Forbidden(c *gin.Context, s ...string) {
	e := getStringOrDefault(s, "權限不足")
	log.With("error", e).Trace(c.Request.URL.Path + " 出現 Forbidden 錯誤。")
	c.JSON(http.StatusInternalServerError, gin.H{
		"message": "Forbidden",
		"error":   e,
	})
}
