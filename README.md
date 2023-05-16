<h1 align="center">TypeScript RPG Practice</h1>

為了增強自己在 TypeScript 的面向對象的功力，特別是抽象類別、類別、界面、聯合類型，參考 [Maxwell Alexius 11 屆鐵人賽](https://ithelp.ithome.com.tw/users/20120614/ironman/2685) 用 TypeScript 的方式，將自己原本要在 Unreal Engine 5 實現的 UnrealDisaster 搬到這裡來。

<p align="center">
    <img src="https://img.shields.io/badge/lang-TypeScript-blue" alt="Angular on npm" />
    <img src="https://img.shields.io/badge/NodeJS-18.12.0-yellow" alt="Angular on npm" />
    <img src="https://img.shields.io/badge/npm-8.19.2-yellow" alt="Angular on npm" />
    <img src="https://img.shields.io/badge/release-0.1.0-brightgreen">
</p>

## 目錄

-   [結構](#結構)
-   [安裝](#安裝)

## 結構

## 安裝

1. 下載此專案。
2. 安裝 docker-compose。
    - 如果是 Windows 或 Mac，請直接去下載 [Docker Desktop For Windows](https://www.docker.com/products/docker-desktop/)，裡面有包含 Docker 和 docker-compose。
    - 如果是 Linux，請先按照[此頁面](https://docs.docker.com/engine/install/ubuntu/)安裝 Docker，然後再執行以下指令：

```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```
3. 接著進入到資料夾，直接用 docker-compose 構建 Docker 容器：

```
cd /path/to/file/tsc-rpg-practice
docker-compose up -d --build
```
4. 進入容器，開始開發！
