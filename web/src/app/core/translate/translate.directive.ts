import { Directive, ElementRef, OnInit } from '@angular/core';
import { Translator } from './translate';

@Directive({
    selector: '[c18n]',
    standalone: true,
})
export class TranslateDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private _srv: Translator
    ) {}

    ngOnInit(): void {
        this._transform();
    }

    // _transform 會將元素的 innerHTML 翻譯成對應的語言。
    // 不能在 constructor 執行，因為元素的 innerHTML 還沒被設定。
    // 所以要在 ngOnInit 執行。
    // 使用 textContent 而不是 innerHTML 是因為 innerHTML 會將元素的內容轉成 HTML，這樣會有安全性問題。
    private _transform() {
        if (!this.el.nativeElement.textContent) return;
        this.el.nativeElement.textContent = this._srv.instant(this.el.nativeElement.textContent);
    }
}
