import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          // после успешного входа перенаправляем на дашборд
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          // обработка ошибки (неверные данные и пр.)
          this.errorMessage = 'Неправильный email или пароль';
        }
      });
    }
  }
}
