import { Pipe, PipeTransform } from '@angular/core';
import { Translator } from './translate';

@Pipe({
    name: 'c18n',
    standalone: true,
    // 如果設定成 pure，只有 input 改變時才會觸發 pipe。
    // 如果設定成 impure，只要有任何改變時就會觸發 pipe。
    pure: false,
})
export class TranslatePipe implements PipeTransform {
    constructor(private _srv: Translator) {}

    transform(value: string, args?: string | string[]): string | undefined {
        if (!value) return;
        return this._srv.instant(value, args);
    }
}
