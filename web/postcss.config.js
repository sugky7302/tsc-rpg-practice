module.exports = {
    plugins: [
        // 類似 scss 的 mixin，
        // 一定要放在 postcss-simple-vars 和 postcss-nested 之前
        require('postcss-mixins'),
        // 類似 scss 的變數
        require('postcss-simple-vars'),
        // 類似 scss 的巢狀語法
        require('postcss-nested'),
        // 移除沒有使用到的 css
        require('@fullhuman/postcss-purgecss')({
            content: ['index.html', '**/*.html'],
            css: ['styles.css', '**/*.css'],
        }),
        // 引入其他 css 檔案
        require('postcss-import'),
        // 使用 css 變數
        require('postcss-preset-env')({
            features: { 'nesting-rules': false },
        }),
        // 自動加入前綴詞
        require('autoprefixer'),
        // 壓縮 css
        require('cssnano')({
            preset: 'default',
        }),
    ],
};