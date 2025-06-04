#syntax=docker/dockerfile:1.3

##########################################
# 全域變數
##########################################
ARG NODE_VERSION=24 \
    ANGULAR_VERSION=20.0.0 \
    PNPM_VERSION=10 \
    NGINX_VERSION=1.27 \
    ALPINE_VERSION=3.17.0 \
    PNPM_DIR="/usr/local/lib/node_modules/pnpm"


#######################################################
# 初始化環境
# 適用於第一次建立 Angular 項目
#######################################################
FROM node:${NODE_VERSION} AS init
ARG ANGULAR_VERSION \
    PNPM_VERSION \
    PNPM_DIR
ENV PNPM_HOME=${PNPM_DIR} \
    PATH="${PNPM_DIR}:$PATH"

WORKDIR /app

# 安裝 PNPM、Angular CLI、依賴包
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    set -xe; \
    npm i -g pnpm@${PNPM_VERSION}; \
    # 設定全域安裝路徑
    pnpm config set global-bin-dir ${PNPM_HOME}; \
    # 設定快取路徑，一定要指定為全域，不然 PlayWright 會報錯
    pnpm config set store-dir "/usr/local/cache/.pnpm-store" --global; \
    pnpm i -g @angular/cli@${ANGULAR_VERSION}; \
    # 指定 PNPM 為 Angular 的套件管理工具
    ng config -g cli.packageManager pnpm;

CMD ["tail", "-f", "/dev/null"]


#############################################
# 把環境變數寫入 environment.ts
#############################################
FROM alpine:${ALPINE_VERSION} AS envsubst
# 因為 ARG 在構建階段等同於 ENV，所以 envsubst 可以寫入檔案裡。
# 這裡是要加載替換字符，這裡宣告的 ARG 變數必須與 docker-compose.yml/service/.../build/args 一致。
ARG TARGET_FILE=.docker/environment.template \
    OUTPUT_FILE=environment.ts \
    MODE \
    HOST_IP

# 因為要替換的檔案只會在構建的時候用到，容器裡面用不到，
# 所以我們用 --mount=type=bind 來掛載。
RUN --mount=type=cache,target=/var/cache/apk,id=apk \
    --mount=type=bind,source=${TARGET_FILE},target=${TARGET_FILE} \
    set -xe && \
    # 安裝 gettext，讓 envsubst 可以使用
    apk add gettext && \
    # 替換環境變數
    envsubst '${MODE}${HOST_IP}' < ${TARGET_FILE} > ${OUTPUT_FILE}

CMD ["tail", "-f", "/dev/null"]


#######################################################
# 開發環境
# 原本是用 Alpine 安裝，但是 PlayWright 偵測不到全域的 PNPM，
# 所以改成直接在 NodeJS 裡面安裝
#######################################################
FROM node:${NODE_VERSION} AS dev
ARG ANGULAR_VERSION \
    PNPM_VERSION \
    PNPM_DIR
ENV PNPM_HOME=${PNPM_DIR} \
    PATH="${PNPM_DIR}:$PATH"

WORKDIR /app

# 安裝 PNPM、Angular CLI
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    set -xe; \
    npm i -g pnpm@${PNPM_VERSION}; \
    # 設定全域安裝路徑
    pnpm config set global-bin-dir ${PNPM_HOME}; \
    # 設定快取路徑，一定要指定為全域，不然 PlayWright 會報錯
    pnpm config set store-dir "/usr/local/cache/.pnpm-store" --global; \
    pnpm i -g @angular/cli@${ANGULAR_VERSION}; \
    # 指定 PNPM 為 Angular 的套件管理工具
    ng config -g cli.packageManager pnpm;

COPY . .

# 因為依賴包可能會變動，所以從上面拆出來
RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    set -xe; \
    # 目前不管是什麼環境都要安裝 devDependencies，因為 build-angular:application 的東西只在 devDependencies
    pnpm install;

CMD ["tail", "-f", "/dev/null"]

##########
# 打包
##########
FROM dev as build

# 因為有 environment.ts，所以不能用 bind
COPY --chmod=755 src/ src/
COPY --from=envsubst environment.ts src/environments/environment.ts

RUN --mount=type=cache,target=/usr/local/cache/.pnpm-store,id=pnpm_store,sharing=locked \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=bind,source=angular.json,target=angular.json \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=tsconfig.app.json,target=tsconfig.app.json \
    set -xe; \
    # tailwind.config.ts 只是 VSCode 用的，所以不用複製
    rm tailwind.config.ts; \
    ng build;

CMD ["tail", "-f", "/dev/null"]

##########
# 生產環境
# 因為進入容器時會遇到 「需要 Alpine Linux ARM64 3.9 或較新的版本」 這個問題
# 所以我把 Nginx 的版本從 1.15.2-alpine 升級成 1.23.4-alpine
# Arvin Yang - 2023/05/17
##########
FROM nginx:${NGINX_VERSION}-alpine as prd
COPY --from=build /app/dist/app/browser /usr/share/nginx/html
# 把 Nginx 模版複製到 Nginx 的設定檔目錄
COPY .docker/nginx.template /etc/nginx/conf.d/
# 把切割 Nginx 的 access.log 的腳本複製到 Logrotate 的設定檔目錄
COPY .docker/logrotate.template /etc/logrotate.d/default.conf
CMD envsubst '${iCloud_API}${proxy_gpt}${stable_diffusion}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && \
    exec nginx -g 'daemon off;'