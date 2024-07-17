import { Injectable, signal } from '@angular/core';

// LANGUAGES 是支援的語言列表。
// 必須與 public/locale 資料夾中的 JSON 檔案名稱一致。
export const LANGUAGES = ['zh-tw', 'en-us'];

@Injectable({
    providedIn: 'root',
})
export class TranslateService {
    // 如果該語言找不到對應的翻譯，就會使用預設語言。
    private _defaultLanguage = LANGUAGES[0];
    public language = signal<string>(this._defaultLanguage);

    // instant 會回傳翻譯結果，如果沒有對應的翻譯，會先去找預設語言的翻譯。再沒有的話就回傳 key。
    public instant(key: string, words?: string | string[]) {
        let translation = this._translate(key);
        if (words) translation = this._replace(translation, words);
        return translation;
    }

    // _replace 會將翻譯中的 %0, %1... 等等的字串取代成傳入的參數。
    private _replace(value: string, words: string | string[]): string {
        if (words instanceof Array) {
            for (let i = 0; i < words.length; i++) {
                value = value.replace('%' + i, this._translate(words[i]));
            }
        } else {
            value = value.replace('%0', this._translate(words));
        }
        return value;
    }

    // _translate 會根據語言到字典找出對應文句，如果沒有對應的翻譯，會先去找預設語言的翻譯。再沒有的話就回傳 key。
    private _translate(key: string): string {
        const dict = this._loadLanguageDict(this.language());
        if (dict[key]) return dict[key];
        return key;
    }

    // _loadLanguageDict 會從 public/locale 資料夾讀取 `this.lang()`.json 的 JSON 檔案，
    private _loadLanguageDict(lang: string) {
        try {
            return require(`../../../../public/locale/${lang}.json`) as Record<string, string>;
        } catch {
            return require(`../../../../public/locale/${this._defaultLanguage}.json`) as Record<
                string,
                string
            >;
        }
    }
}
