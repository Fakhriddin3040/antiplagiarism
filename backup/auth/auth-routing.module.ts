// app-routing.module.ts
import {Routes} from '@angular/router';
import {CompareComponent} from '../documents/compare/compare.component';
import {AuthGuard} from '../core/guards/auth-guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },           // перенаправление на дашборд по умолчанию
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  // Альтернатива: { path: 'login', component: LoginComponent } без ленивой загрузки
  { path: 'register', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: 'documents', loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule), canActivate: [AuthGuard] },
  { path: 'compare', component: CompareComponent, canActivate: [AuthGuard] },
  // compare не обязательно лениво, можно сразу, либо поместить в DocumentsModule/routes
  { path: 'check/:documentId', loadChildren: () => import('./plagiarism/plagiarism.module').then(m => m.PlagiarismModule), canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'dashboard' } // обработка неизвестных маршрутов
];
