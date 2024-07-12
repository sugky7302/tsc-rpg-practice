#!/bin/bash
#! 還不能用
# 設計一個可以管理 go module 的 script，特別是區分不同的環境
# 1. 可以指定環境，例如：dev, test, prod
# 2. 可以指定要執行的指令，例如：build, test, run, get, ...
# 3. 可以指定要執行的 package，例如：github.com/teed7334-restore/restore-api
# 4. 可以指定要執行的 function，例如：main
# 5. 可以指定要執行的參數，例如：-h
# 6. 保持原本的 go mod 指令
# History:
# 2024/01/14 Arvin Yang: Initial

if [ ! -d "$GOROOT" ]; then
    echo "Error: We can't find the project path. Please check the environment variable: GOROOT"
    exit 1
fi

# 取得專案名稱和版本
project_name=$(basename $GOROOT)
version=$(go version | awk '{print $3}' | sed 's/go//g')

# create_environment 建立環境
# 做法是在專案目錄下建立一個 .goenv 資料夾，並且在裡面建立 go.mod 和 go.sum
# 然後在 /go 建立一個 env 資料夾，裡面建立 dev 和 main 資料夾
# 裡頭各塞一個 go.mod 和 go.sum，並且連結到專案目錄下的 .goenv 資料夾
# 利用 go module 的功能以及 ln 綁定到 /go/pkg/mod，達到環境的切換
function create_environment {
    # 建立環境資料夾
    if [ ! -d "$GOROOT/.goenv" ]; then
        mkdir $GOROOT/.goenv
    fi

    # 生成主環境
    mkdir -p /go/env/main/mod
    if [ ! -f "$GOROOT/.goenv/go.mod" ]; then
        touch $GOROOT/.goenv/go.mod
        touch $GOROOT/.goenv/go.sum
        echo "module $project_name" >>$GOROOT/.goenv/go.mod
        echo "" >>$GOROOT/.goenv/go.mod
        echo "go $version" >>$GOROOT/.goenv/go.mod
    fi

    # 連結到 main 環境
    if [ ! -f "/go/env/main/go.mod" ]; then
        ln -s $GOROOT/.goenv/go.mod /go/env/dev/go.mod
        ln -s $GOROOT/.goenv/go.sum /go/env/dev/go.sum
    fi

    # 生成開發環境
    mkdir -p /go/env/dev/mod
    if [ ! -f "$GOROOT/.goenv/go.dev.mod" ]; then
        touch $GOROOT/.goenv/go.dev.mod
        touch $GOROOT/.goenv/go.dev.sum
        echo "module $project_name" >>$GOROOT/.goenv/go.dev.mod
        echo "" >>$GOROOT/.goenv/go.dev.mod
        echo "go $version" >>$GOROOT/.goenv/go.dev.mod
    fi

    # 連結到 dev 環境
    if [ ! -f "/go/env/dev/go.mod" ]; then
        ln -s $GOROOT/.goenv/go.dev.mod /go/env/dev/go.mod
        ln -s $GOROOT/.goenv/go.dev.sum /go/env/dev/go.sum
    fi
}

function switch_env {
    # 進入 main 環境
    cd /go/env/$1
    # 把 /go/pkg/mod 資料夾連結到主環境的 mod 資料夾
    rm -rf /go/pkg/mod
    ln -sf /go/env/$1/mod /go/pkg/mod
}

# go_get 強化 go get 指令
# $1: get 單詞，需要忽略
# $2: 指令
function go_get {
    case $2 in
    --dev)
        switch_env dev
        # 因為第二個參數是 --dev，所以第三個參數才是 package
        go get $3 $4
        ;;
    -D)
        switch_env dev
        # 因為第二個參數是 --dev，所以第三個參數才是 package
        go get $3 $4
        ;;
    *)
        switch_env main
        go get $2 $3
        # 把主環境的 mod 資料夾複製到開發環境
        cp -r /go/env/main/mod /go/env/dev/mod
        ;;
    esac
    exit 0
}

# go_mod 強化 go mod 指令
# 主要是下載 package 時，需要切換環境
function go_mod {
    case $2 in
    download)
        create_environment
        case $3 in
        --dev)
            switch_env dev
            go mod download
            ;;
        -D)
            switch_env dev
            go mod download
            ;;
        *)
            switch_env main
            go mod download
            # 把主環境的 mod 資料夾複製到開發環境
            cp -r /go/env/main/mod /go/env/dev/mod
            ;;
        esac
        ;;
    init)
        # 如果有指定專案名稱，就用指定的，否則就用目前的目錄名稱
        if [ $3 != "" ]; then
            export GOROOT=$3
        fi

        create_environment
        ;;
    *)
        switch_env dev
        go mod $2 $3 $4 $5 $6 $7 $8 $9
        ;;
    esac
}

# help 顯示 go-cli.sh 的使用說明
function help {
    echo "go-cli is a simple shell script to enhance Golang CLI."
    echo "Usage:"
    echo "  go-cli.sh <command> [arguments] [options]"
    echo ""
    echo "The commands are:"
    echo "  bug         start a bug report"
    echo "  build       compile packages and dependencies"
    echo "  clean       remove object files and cached files"
    echo "  doc         show documentation for package or symbol"
    echo "  env         print Go environment information"
    echo "  fix         update packages to use new APIs"
    echo "  fmt         gofmt (reformat) package sources"
    echo "  generate    generate Go files by processing source"
    echo "  get         add dependencies to current module and install them"
    echo "  install     compile and install packages and dependencies"
    echo "  list        list packages or modules"
    echo "  mod         module maintenance"
    echo "  work        workspace maintenance"
    echo "  run         compile and run Go program"
    echo "  test        test packages"
    echo "  tool        run specified go tool"
    echo "  version     print Go version"
    echo "  vet         report likely mistakes in packages"
    echo "Use \"go <command> -h\" for more information about a command."
    exit 0
}
# go install -v golang.org/x/tools/gopls@latest
case $1 in
-h)
    help
    ;;
--help)
    help
    ;;
get)
    create_environment
    go_get $@
    ;;
mod)
    go_mod $@
    ;;
run)
    cd $GOROOT
    # 把 /go/pkg/mod 資料夾連結到開發環境的 mod 資料夾
    rm -rf /go/pkg/mod
    ln -sf /go/env/dev/mod /go/pkg/mod
    # 因為根目錄沒有 go.mod，所以要連結到主環境的 go.mod
    ln -sf $GOROOT/.goenv/go.mod $GOROOT/go.mod
    ln -sf $GOROOT/.goenv/go.sum $GOROOT/go.sum
    go run $2 $3 $4 $5 $6 $7 $8 $9
    rm -rf $GOROOT/go.mod
    rm -rf $GOROOT/go.sum
    ;;
build)
    cd $GOROOT
    # 把 /go/pkg/mod 資料夾連結到主環境的 mod 資料夾
    rm -rf /go/pkg/mod
    ln -sf /go/env/main/mod /go/pkg/mod
    # 因為根目錄沒有 go.mod，所以要連結到主環境的 go.mod
    ln -sf $GOROOT/.goenv/go.mod $GOROOT/go.mod
    ln -sf $GOROOT/.goenv/go.sum $GOROOT/go.sum
    go build $2 $3 $4 $5 $6 $7 $8 $9
    rm -rf $GOROOT/go.mod
    rm -rf $GOROOT/go.sum
    ;;
*)
    go $@
    ;;
esac
