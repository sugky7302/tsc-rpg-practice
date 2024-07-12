# Golang 開發指南
本文記錄此專案在開發過程中所遇到的問題，以及解決方法，並且會持續更新。目錄結構請參考[這裡](https://github.com/golang-standards/project-layout/blob/master/README_zh-TW.md)。
本專案使用 **Golang 1.22.2**，有許多有趣的功能，詳情可以查看[這裡](https://tonybai.com/2023/04/26/go-1-21-foresight/)，主要是 `log/slog` 官方新的日誌標準庫非常重要，並支援非常多的[擴充套件](https://github.com/go-slog/awesome-slog?tab=readme-ov-file)。

## 初始化環境建置
Dockerfile 有一個 **init** 階段，只要 docker-compose 建構時指定 target=init，就能夠建立簡單的專案結構。接著，請使用 `docker cp container:/app ./your/folder` 把容器內的檔案全部複製到本地，才能進行下一步開發。

## 開發環境建置
為了同步容器跟本地的檔案，必須使用 volume 來連通。
記得每次開發完畢要 go build 一次，這樣生產環境才能夠執行使用。

## 功能劃分
internal 放置我們這支程式主打的服務，並考慮未來拆分的時候不會影響到其他服務。目前有以下服務：
- api: 大部分 API 會放在這一個資料夾。
- mock: 模擬第三方的 API。
- middleware: Gin 中間層。
- model: 資料結構。
- util: Gin 常用的回傳函數。

## Logger 使用時間和歸屬
由於本專案使用 Gin 作為後台，因此 Gin.logger 需要輸出到控制台以及檔案，另外還有各服務對應的 logger。根據上述，logger 簡單分成以下檔案：
- access.log: 呈現主機目前的狀態以及各服務的重點 log，供後台監控人員快速掌握問題點。
- trace.log: 記錄使用者操作的細節，協助開發人員修正錯誤或改善功能。

## Swagger - 可視化 API 網頁
本專案有使用 `gin-swagger` 套件，透過根目錄下 `swag init` 指令，它會搜尋所有子目錄底下的特殊註解，並轉譯為 swagger 的格式。由於它只會以該目錄向下搜尋，因此我們**無法把 `main.go` 和其它程式碼拆成兩個資料夾**，只能把 `main.go` 放在根目錄下。