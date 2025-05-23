// src/app/auth/auth.module.ts


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';


@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule { }
