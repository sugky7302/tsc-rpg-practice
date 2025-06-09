import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Translator } from './translate/translate';

@Injectable({
    providedIn: 'root',
})
export class TitleController {
    // Title 控制網頁的標題，也就是 <html><head><title>
    // 這裡使用 Angular 的 Title 服務來設定標題

    private translator = inject(Translator);
    private title = '';
    private _srv = inject(Title);

    update(text: string, suffix: string = '') {
        this.title = this.translator.instant(text) + suffix;
        this._srv.setTitle(this.title);
    }
}
