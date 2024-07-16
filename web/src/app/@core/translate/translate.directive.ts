import { Directive, ElementRef, inject } from '@angular/core';
import { TranslateService } from './translate.service';

@Directive({
  selector: '[translate]',
  standalone: true
})
export class TranslateDirective {
  el = inject(ElementRef);
  _srv = inject(TranslateService);

  ngOnChanges() {
    console.log("hihi");
    this.el.nativeElement.innerHTML = this._srv.instant(this.el.nativeElement.innerHTML);
  }

}
