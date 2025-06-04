package myhttptest

import (
	"context"
	"math/rand"
	"net/http"
	"net/http/httptest"
	net_url "net/url" // 因為無法使用 url.Values，所以這裡要取別名來取代 net/url
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// 如果使用自定義的中間件，建立 gin.Engine 時，一定要用 gin.New()
func NewServer() *MockServer {
	// 建立全新的 Gin 伺服器
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())

	return &MockServer{
		engine: router,
		routes: make(map[string]*gin.RouterGroup),
		header: make(map[string]string),
	}
}

// MockServer 是一個簡單的測試用 Gin 伺服器
// 藉由 Run 方法，可以在測試中模擬 HTTP 請求
// 這裡會設定 Gin 的 Recovery 中間件，當發生 panic 時，會自動回傳 500 錯誤。
// 這裡會設定 Gin 的 Logger 中間件，會輸出所有請求的資訊在控制台。
type MockServer struct {
	// Gin 的伺服器，是 net/http 的封裝
	// 內部設定路由和 http.handler 的映射
	// 攔截所有 http 請求並轉向到 Gin 內部邏輯
	engine *gin.Engine

	// 記錄路由和函數之間的映射
	// NewServer() 透過反射機制，調用 Server 裡面所有名字符合 RegisterRouteOf 的成員方法
	// 每個方法裡面都至少有一個 Server.GetRoute 函數，這個函數會把路由註冊到 routes 裡
	routes map[string]*gin.RouterGroup

	// 記錄請求的 header
	// 因為只有在 Run 方法裡面才會設定 header，所以直接建立一個 map 來記錄
	// 每次 SetHeader 都會覆蓋掉原本的值
	// Run 執行後會清空
	header map[string]string
}

// 中間件必須在註冊路由之前被註冊，不然無效
func (m *MockServer) Use(middleware ...gin.HandlerFunc) *MockServer {
	m.engine.Use(middleware...)
	return m
}

func (m *MockServer) SetHeaders(headers map[string]string) *MockServer {
	m.header = headers
	return m
}

func (m *MockServer) SetHeader(key string, value string) *MockServer {
	m.header[key] = value
	return m
}

// Listen 是一個阻塞的函數，會啟動伺服器，並監聽指定的位址。
// 通常是模擬外部 API 的回應，測試自己寫的函數。
func (m *MockServer) Listen(addr string) error {
	return m.engine.Run(addr)
}

// 註冊路由一定要在中間件後面，不然中間件會無效
func (m *MockServer) Handle(method string, url string, f func(*gin.Context)) *MockServer {
	m.engine.Handle(method, url, f)
	return m
}

// Run 方法可以在測試中模擬 HTTP 請求。
// {string} url - 請求的路徑
// {url.Values} form - 請求的內容
// {func(*httptest.ResponseRecorder)} f - 測試邏輯
func (m *MockServer) Run(method, url string, form *net_url.Values, f func(*httptest.ResponseRecorder)) *MockServer {
	if form == nil {
		form = &net_url.Values{}
	}

	// 將表單數據編碼為 URL 格式
	formEncoded := form.Encode()

	// 將 URL 編碼的表單數據轉換為 io.Reader
	body := strings.NewReader(formEncoded)

	// 建立 httptest 的 ResponseRecorder 和 Request
	w := httptest.NewRecorder()

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(rand.Intn(20))*time.Second)
	defer cancel()

	req, _ := http.NewRequestWithContext(ctx, method, url, body)
	// 因為要讓 Gin 可以收到 client ip，所以這邊填上 localhost
	req.RemoteAddr = "127.0.0.1:0"
	// 設置 Content-Type 標頭
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// 設置自定義的標頭
	for k, v := range m.header {
		req.Header.Set(k, v)
	}

	// 加進 Request 之後就清空 header，方便下次使用
	// m.header = make(map[string]string)

	// 啟動伺服器
	// 這裡不能用 goroutine 執行，因為會沒有回傳值
	m.engine.ServeHTTP(w, req)

	if w.Result().Body != nil {
		defer w.Result().Body.Close()
	}

	// 執行測試邏輯
	f(w)

	return m
}

// RunJson 方法可以在測試中模擬使用 JSON 格式傳輸的 HTTP 請求。
// {string} url - 請求的路徑
// {string} jsonStr - 請求的 JSON
// {func(*httptest.ResponseRecorder)} f - 測試邏輯
func (m *MockServer) RunJson(method, url string, jsonStr string, f func(*httptest.ResponseRecorder)) *MockServer {
	// 將 URL 編碼的表單數據轉換為 io.Reader
	body := strings.NewReader(jsonStr)

	// 建立 httptest 的 ResponseRecorder 和 Request
	w := httptest.NewRecorder()

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(rand.Intn(20))*time.Second)
	defer cancel()

	req, _ := http.NewRequestWithContext(ctx, method, url, body)
	// 因為要讓 Gin 可以收到 client ip，所以這邊填上 localhost
	req.RemoteAddr = "127.0.0.1:0"
	// 設置 Content-Type 標頭
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	// 設置自定義的標頭
	for k, v := range m.header {
		req.Header.Set(k, v)
	}

	// 加進 Request 之後就清空 header，方便下次使用
	// m.header = make(map[string]string)

	// 啟動伺服器
	// 這裡不能用 goroutine 執行，因為會沒有回傳值
	m.engine.ServeHTTP(w, req)

	if w.Result().Body != nil {
		defer w.Result().Body.Close()
	}

	// 執行測試邏輯
	f(w)

	return m
}
