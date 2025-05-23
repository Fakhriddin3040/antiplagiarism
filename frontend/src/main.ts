// main.ts


import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideRouter} from '@angular/router';
import {importProvidersFrom} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter([
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./app/auth/auth.routes').then((m) => m.AUTH_ROUTES)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./app/dashboard/dashboard.routes').then(m => m.routes)
      }
    ])
  ]
});
