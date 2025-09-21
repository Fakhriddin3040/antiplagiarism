import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../../../features/auth/auth.service';
import {AuthHelper} from '../../../../helpers/auth/auth.helper';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    RouterLink,
    MatFormField
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    const request = this.form.value;
    this.auth.login(request).subscribe({
      next: (value) => {
        AuthHelper.setToken(value.accessToken);
        this.router.navigate(['page-layout/authors']);
      },
      error: () => {
        this.form.reset();
        alert('Неверный логин или пароль');
      },
    });
  }
}
