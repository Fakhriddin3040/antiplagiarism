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
import {NgbActiveModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from './app/guards/auth/auth.guard';
import { AUTH_SERVICE } from './app/core/features/auth/auth.service.interface';
import { AuthService } from './app/features/auth/auth.service';
import { AuthInterceptor } from './app/interceptors/auth/auth.interceptor';
import {CaseTransformInterceptor} from './app/interceptors/case-transform/case-transform.interceptor';
import {FOLDER_SERVICE} from './app/core/features/folder/folder.service.token';
import {FolderService} from './app/features/folder/folder.service';
import {AUTHOR_SERVICE} from './app/core/features/author/author.service.token';
import {AuthorService} from './app/features/author/author.service';
import {AUTHOR_TABLE_DATA_SOURCE} from './app/core/features/author/author.table-data-source.token';
import {AuthorTableDataSource} from './app/features/author/author.table-data-source';
import {FormModalService} from './app/core/services/form-modal.service';
import {DOCUMENT_DATA_SOURCE, DOCUMENT_SERVICE} from './app/core/features/document/document.tokens';
import {DocumentDataSource} from './app/features/document/document.data-source';
import {DocumentService} from './app/features/document/document.service';

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./app/routes/auth-routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'page-layout',
    loadComponent: () =>
      import('./app/page-layout/page-layout.component')
        .then(m => m.PageLayoutComponent),
    children: [
      {
        path: 'authors',
        loadComponent: () => import('./app/components/author/author.data-table.component').then(m => m.AuthorDataTableComponent),
      },
      {
        path: "documents",
        loadComponent: () => import('./app/components/document.data-table/document.data-table.component').then(m => m.DocumentDataTableComponent),
      }
    ]
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(NgbModalModule),

    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),

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

    { provide: FOLDER_SERVICE, useClass: FolderService },
    { provide: AUTHOR_TABLE_DATA_SOURCE, useClass: AuthorTableDataSource },
    { provide: AUTH_SERVICE, useExisting: AuthService },
    { provide: AUTHOR_SERVICE, useClass: AuthorService },
    { provide: DOCUMENT_DATA_SOURCE, useClass: DocumentDataSource },
    { provide: DOCUMENT_SERVICE, useClass: DocumentService },
    { provide: NgbActiveModal, useClass: NgbActiveModal },
  ],
});
