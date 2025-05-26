import {inject, OnInit} from '@angular/core';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    MatFormField,
    MatLabel,
    MatFormField,
    MatFormField,
    MatFormField,
    MatFormField,
    MatFormField,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatButton
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form!: FormGroup;
  loading: boolean = false;

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', Validators.required]
      },
      { validators: this.matchPassword }
    )
  }

  public getFormTouched() {
    this.form.touched;
}

  private matchPassword(group: FormGroup) {
    const pass = group.get('password')?.value;
    const pass2 = group.get('passwordConfirm')?.value;
    return pass === pass2 ? null : { passwordMismatch: true }
  }

  submit(): void {
    if(this.form.invalid) return;

    this.loading = true;


    this.auth.register(this.form.value)
      .subscribe({
        next: (response) => {
          this.auth.processTokenResponse(response);
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
          alert("Упс... Что-то пошло не так. Обратитесь к службе поддержки.");
        },
      });
  }
}
