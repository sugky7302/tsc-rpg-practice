#!/bin/bash
# 記錄所有手動安裝的套件
# 因為 go.mod 會記錄所有的套件，不知道哪些是手動安裝的
# 記得要固定版本

# Gin
go get github.com/gin-gonic/gin@v1.9.1
go get github.com/gin-contrib/cors@v1.5.0

# Test
go get github.com/stretchr/testify/assert@v1.8.4

# Swagger
go get github.com/swaggo/swag@v1.16.3
go get github.com/swaggo/swag/cmd/swag
go get github.com/swaggo/gin-swagger@v1.6.0
go get github.com/swaggo/files@v1.0.1
go get github.com/mailru/easyjson/jwriter@v0.7.7

# logger
go get github.com/sirupsen/logrus@v1.9.3
go get github.com/natefinch/lumberjack@v2

# http
go get github.com/imroc/req/v3@v3.42.3

# console colorize
go get github.com/fatih/color@v1.16.0

# TOML
go get github.com/BurntSushi/toml@v1.3.2

# regex
go get github.com/dlclark/regexp2@v1.11.0