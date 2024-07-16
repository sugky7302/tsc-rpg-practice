import { Component } from '@angular/core';
import { LogoComponent } from "../../components/logo/logo.component";
import { TranslateDirective } from '../../@core/translate/translate.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogoComponent, TranslateDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
