#!/bin/bash
# Program:
#   構建 swaggo 為執行檔，並執行 swag init。
# Version: 1.1.0
# Author: Arvin Yang
# History:
# 2024/01/14 custom version
# 2022/06/13 first commit

swag_version="1.16.3"
main_path="main.go"
output_path="/app/docs"

if [ ! -f "/go/bin/swag" ]; then
    dir="$GOPATH/pkg/mod/github.com/swaggo/swag@v$swag_version/cmd/swag"
    file="$GOPATH/bin/swag"
    go build -o $file $dir/main.go
fi

swag init -g $main_path -o $output_path
