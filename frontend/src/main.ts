/// <reference types="@angular/localize" />

// main.ts


import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideRouter} from '@angular/router';
import {importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthInterceptor} from './app/interceptors/auth/auth.interceptor';
import {DashboardComponent} from './app/components/dashboard/dashboard.component';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import {AuthGuard} from './app/guards/auth/auth.guard';
import {AUTH_SERVICE} from './app/core/features/auth/auth.service.interface';
import {AuthService} from './app/features/auth/auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(NgbModalModule),
    provideHttpClient(),
    { provide: AUTH_SERVICE, useClass: AuthService },
    provideAngularSvgIcon(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter([
      {
        path: '',
        redirectTo: 'dashboard/documents',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./app/routes/auth-routes').then((m) => m.AUTH_ROUTES)
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'products',
            loadComponent: () => import('./app/components/data-table/implementations/demo/product-data-table-demo').then(m => m.DemoProductsComponent)
          }
        ]
      },
      {
        path: 'products',
        loadComponent: () => import('./app/components/data-table/implementations/demo/product-data-table-demo').then(m => m.DemoProductsComponent)
      }
    ]),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
  ]
});
