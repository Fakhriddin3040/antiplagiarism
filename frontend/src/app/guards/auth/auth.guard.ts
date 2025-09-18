import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AUTH_SERVICE} from '../../core/features/auth/auth.service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  router = inject(Router);
  authService = inject(AUTH_SERVICE);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
      if (!this.authService.isAuthenticated()) {
        return this.router.navigate(["/auth/login"]);
      }
      return true
    }

}
