import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import {catchError} from "rxjs";

export const LANGUAGES = [
    "zh-tw",
    "en-us",
]

@Injectable({
    providedIn: "root",
})
export class TranslateService {
    // 使用 Http 服務從 public 讀取翻譯字典。
    private _http = inject(HttpClient);

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
                value = value.replace("%" + i, this._translate(words[i]));
            }
        } else {
            value = value.replace("%0", this._translate(words));
        }
        return value;
    }

    // _translate 會根據語言到字典找出對應文句，如果沒有對應的翻譯，會先去找預設語言的翻譯。再沒有的話就回傳 key。
    private _translate(key: string): string {
        console.log(key);
        this._loadLanguage(this.language()).subscribe((data: any) => {
            console.log(data);
        });

        return key;
    }

    private _loadLanguage(lang: string) {
        return this._http.get(`/public/locale/${lang}.json`)
        .pipe(
            catchError(() => this._http.get(`/public/locale/${this._defaultLanguage}.json`))
        )
    }
}
