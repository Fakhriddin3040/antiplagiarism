import {AuthRequest} from './types/auth-request.type';
import {Observable} from 'rxjs';
import {AuthResponse} from './types/auth-response.type';
import {RegistrationResponse} from './types/registration-response.type';
import {RegistrationRequest} from './types/registration-request.type';
import {InjectionToken} from '@angular/core';

export interface AuthServiceInterface {
  login(request: AuthRequest): Observable<AuthResponse>
  register(request: RegistrationRequest): Observable<RegistrationResponse>
  isAuthenticated(): boolean;
}


export const AUTH_SERVICE = new InjectionToken<AuthServiceInterface>('AUTH_SERVICE');
