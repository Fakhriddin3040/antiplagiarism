import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthModule} from './auth/auth.module';
import {LoginComponent} from './auth/pages/login/login.component';

@Component({
  selector: 'app-root',
  imports: [AuthModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
