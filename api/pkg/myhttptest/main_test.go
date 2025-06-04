package myhttptest

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMockServer(t *testing.T) {
	ast := assert.New(t)
	NewServer().Handle(http.MethodGet, "/hello", func(c *gin.Context) {
		c.String(200, "Hello, World!")
	}).Run(http.MethodGet, "/hello", nil, func(r *httptest.ResponseRecorder) {
		ast.Equal(http.StatusOK, r.Code)
		ast.Equal("Hello, World!", r.Body.String())
	})
}

func TestListenAndRequest(t *testing.T) {
	ast := assert.New(t)
	go func() {
		NewServer().Handle(http.MethodGet, "/a", func(c *gin.Context) {
			fmt.Println("Running Route a")
			c.String(200, "Listening a")
		}).Handle(http.MethodGet, "/b", func(c *gin.Context) {
			fmt.Println("Running Route b")
			c.JSON(200, gin.H{"message": "Listening b"})
		}).Listen("127.0.0.1:1235")
	}()

	// 必須等待一個時間讓伺服器啟動，不然底下全部都會報錯
	time.Sleep(10 * time.Microsecond)

	resp, e := http.Get("http://127.0.0.1:1235/a")
	if !ast.Equal(nil, e) {
		t.Errorf("連線 localhost:1235/a 發生錯誤: %s", e.Error())
	}

	ast.Equal(http.StatusOK, resp.StatusCode)
	body, err := ioutil.ReadAll(resp.Body)
	if !ast.Equal(nil, err) {
		t.Errorf("讀取 localhost:1235/a 的內容時發生錯誤: %s", err.Error())
	}
	resp.Body.Close()

	ast.Equal("Listening a", string(body))

	resp, e = http.Get("http://localhost:1235/b")
	if !ast.Equal(nil, e) {
		t.Errorf("連線 localhost:1235/b 發生錯誤: %s", e.Error())
	}

	ast.Equal(http.StatusOK, resp.StatusCode)
	body, err = io.ReadAll(resp.Body)
	if !ast.Equal(nil, err) {
		t.Errorf("讀取 localhost:1235/a 的內容時發生錯誤: %s", err.Error())
	}
	resp.Body.Close()

	ast.Equal(`{"message":"Listening b"}`, string(body))
}
