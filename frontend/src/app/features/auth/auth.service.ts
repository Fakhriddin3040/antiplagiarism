import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthServiceInterface} from '../../core/features/auth/auth.service.interface';
import {Observable} from 'rxjs';
import {AuthRequest} from '../../core/features/auth/types/auth-request.type';
import {AuthResponse} from '../../core/features/auth/types/auth-response.type';
import {RegistrationRequest} from '../../core/features/auth/types/registration-request.type';
import {RegistrationResponse} from '../../core/features/auth/types/registration-response.type';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';
import {EnvironmentHelper} from '../../helpers/environment/environment.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {
  private _httpClient = inject(HttpClient);
  private _loginEndpoint = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.LOGIN);
  private _registerEndpoint = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.REGISTER);

  login(request: AuthRequest): Observable<AuthResponse> {
      return this._httpClient.post<AuthResponse>(this._loginEndpoint, request);
  }
  register(request: RegistrationRequest): Observable<RegistrationResponse> {
      return this._httpClient.post<RegistrationResponse>(this._registerEndpoint, request);
  }
  isAuthenticated(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }
}
