import { Component } from '@angular/core';
import { TranslateDirective } from '../../@core/translate/translate.directive';

@Component({
    selector: 'app-logo',
    standalone: true,
    imports: [TranslateDirective],
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.css',
})
export class LogoComponent {}
