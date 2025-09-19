/// <reference types="@angular/localize" />

import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from './app/guards/auth/auth.guard';
import { AUTH_SERVICE } from './app/core/features/auth/auth.service.interface';
import { AuthService } from './app/features/auth/auth.service';
import { AuthInterceptor } from './app/interceptors/auth/auth.interceptor';
import {CaseTransformInterceptor} from './app/interceptors/case-transform/case-transform.interceptor';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard/documents', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./app/routes/auth-routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./app/components/data-table/implementations/demo/product-data-table-demo')
            .then(m => m.DemoProductsComponent),
      },
    ],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./app/components/data-table/implementations/demo/product-data-table-demo')
        .then(m => m.DemoProductsComponent),
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(NgbModalModule),

    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

    { provide: AUTH_SERVICE, useClass: AuthService },

    provideAngularSvgIcon(),

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CaseTransformInterceptor,
      multi: true,
    },
  ],
});
