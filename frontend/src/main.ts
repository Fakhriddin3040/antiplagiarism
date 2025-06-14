/// <reference types="@angular/localize" />

// main.ts


import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideRouter} from '@angular/router';
import {importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {NavigationComponent} from './app/components/navigation/navigation.component';
import {AuthInterceptor} from './app/interceptors/auth/auth.interceptor';
import {DashboardComponent} from './app/components/dashboard/dashboard.component';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import {AuthGuard} from './app/guards/auth/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, NgbModalModule),
    provideHttpClient(),
    provideAngularSvgIcon(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter([
      {
        path: 'layout',
        loadComponent: () => import('./app/components/document-layout/document-layout.component').then(m => m.DocumentLayoutComponent)
      },
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
            path: 'documents',
            loadComponent: () => import('./app/components/document-layout/document-layout.component').then(m => m.DocumentLayoutComponent)
          }
        ]
      },
      {
        path: 'navbar',
        component: NavigationComponent
      },
      // {
      //   path: 'author',
      //   component: AuthorComponent
      // },
    ]),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
  ]
});
