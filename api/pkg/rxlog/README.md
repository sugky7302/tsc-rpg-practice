# Logger
為了解決原生 logger 難用的問題，特別開發一個能夠「開箱即用」的高擴充性日誌功能。這個 Logger 模組基於 logrus & lumberjack 套件實作，主要達到將錯誤日誌與正常日誌分開以及將日誌輸出到檔案與控制台等兩大功能。

## 功能介紹
logger 輸出的美化以及限制是必備功能，本套件也支援並設計幾套常用工具，分別放在 `formatter/` 和 `hook/` 資料夾下。

### formatter
美化日誌輸出。

- beauty: 格式化日誌和日誌等級有顏色，以求標準化輸出。

### hook
限制或轉換日誌資料，會在 formatter 執行之前生效。

- fileline: 在輸出上顯示檔名和行數。內部支援相對路徑，但是必須設定環境變數 `GO_PROJ_PATH`。
    - 在 **logrus 1.5.0**，把 `logrus.SetReportCaller(true)` 放在裡面會造成程式卡住。
- maxlevel: 只有日誌等級低於限制才會輸出。因為 logrus 本身隱含 minlevel，所以另一個不需要實現。

## CHANGELOG
### 3.0 - 2024-03-19
- 下載 logurs 和 lumberjack 至本地，並新增讀取 entry.Data 的程式，從根源阻絕 goroutine 讀寫的問題。

### 2.0 - 2024-01-16
- 模仿 slog 功能，加強擴充性。
- 遵循 ReactiveX 原則。

### 1.0 - 2023-05-14
成功實現檔案日誌和控制台日誌同步輸出。