# syntax=docker/dockerfile:1.3

######################
# 全域變數
######################
ARG GO_VERSION=1.24

######################
# 第一次建構
######################
FROM golang:${GO_VERSION} AS init
ENV PATH="$PATH:$(go env GOPATH)/bin"
WORKDIR /app
# 下面兩行是生成一個空的 go.mod 和 go.sum，讓 dev 階段的 go mod download 可以正常運作
RUN go mod init app; \
    touch go.sum; \
    mkdir bin && touch bin/!put-your-executable-here.txt; \
    mkdir internal && echo "This is an official direcotry in Golang Compiler." > internal/!put-your-code-here.txt; \
    mkdir cmd && echo "package main\n\nfunc main() {}" > cmd/main.go
CMD ["tail", "-f", "/dev/null"]


######################
# 開發階段
######################
FROM golang:${GO_VERSION} AS dev
ARG BUILD_ENV=dev
# 一定要設定 CGO_ENABLED=0，不然會無法編譯成靜態檔案，
# 導致執行檔在 scratch 環境無法執行
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    PATH="$PATH:$(go env GOPATH)/bin" \
    GO_PROJ_PATH=/app

WORKDIR /app

# 第一次會掛載空的 cache，第二次會掛載有下載過的 cache 到 /go/pkg/mod/
RUN --mount=type=cache,target=/go/pkg/mod/,id=go_pkg,sharing=locked \
# bind 只是當下把檔案以「唯讀」掛載到指定位置，
# 不會同步檔案，無法被 cache，也無法被 COPY 到其他 stage。
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    # uname -s 是讀取系統名稱，然後用 tr 轉成小寫。
    export GOOS="$(uname -s)" | tr "[:lower:]"; \
    # uname -m 是讀取系統架構，如果是 aarch64 就改成 amd64。
    if [ "$(uname -m)" = "aarch64" ]; then \
        export GOARCH="arm64"; \
    else \
        export GOARCH="$(uname -m)"; \
    fi; \
    go mod download

CMD ["tail", "-f", "/dev/null"]


######################
# 部署與執行
######################
FROM scratch AS deploy
ENV GIN_MODE=release \
    GO_PROJ_PATH=/usr/local/bin

WORKDIR /usr/local/bin
COPY --chmod=755 bin/app /usr/local/bin/app
# 因為 scratch 沒有 sh，只能指定絕對路徑
ENTRYPOINT ["/usr/local/bin/app"]

