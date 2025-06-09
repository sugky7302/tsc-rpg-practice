import { Component } from '@angular/core';

@Component({
    selector: 'ui-input',
    imports: [],
    template: ` <div class="input-container card"></div>`,
    styleUrls: ['../styles/card.css'],
    styles: `
        .input-container {
            background-color: red;
        }
    `,
})
export class InputComponent {}
