import { Component, inject } from '@angular/core';
import { InputComponent } from '@components/input.component';
import { TitleController } from '@core/title';

@Component({
    selector: 'page-login',
    imports: [InputComponent],
    templateUrl: './login.html',
    styleUrls: ['./login.css', '../../styles/grid.css', '../../styles/card.css'],
})
export class LoginPage {
    titleController = inject(TitleController);

    ngOnInit() {
        this.titleController.update('logining', '...');
    }
}
