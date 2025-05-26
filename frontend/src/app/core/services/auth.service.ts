import {Injectable} from '@angular/core';
import {BehaviorSubject, delay, map, Observable, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TokenApiResponse, LoginRequest, TokenResponse} from '../models/login.interface';
import {RegisterApiRequest, RegisterRequest} from '../models/register.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public static accessTokenKey = 'accessToken';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<TokenResponse> {
    // Здесь должна быть реальная авторизация
    return this.http.post<TokenApiResponse>(
      `${environment.apiUrl}/auth/login`, request
    ).pipe(
      map(response => ({
         accessToken: response.access_token
      }) as TokenResponse),
      tap(response => {
        localStorage.setItem(AuthService.accessTokenKey, response.accessToken)
      })
    )
  }

  register(request: RegisterRequest): Observable<TokenResponse> {
    const apiRequest = this.adaptRegisterRequest(request);

    return this.http.post<TokenApiResponse>(
      `${environment.apiUrl}/auth/register`, apiRequest
    ).pipe(
      map(response => ({
        accessToken: response.access_token
      }))
    )
  }

  processTokenResponse(response: TokenResponse): void {
    localStorage.setItem(AuthService.accessTokenKey, response.accessToken);
  }

  logout(): void {
    localStorage.removeItem(AuthService.accessTokenKey);
    this.isLoggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AuthService.accessTokenKey);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private adaptRegisterRequest(request: RegisterRequest): RegisterApiRequest {
    return {
      email: request.email,
      password: request.password,
      first_name: request.firstName,
      last_name: request.lastName
    };
  }
}
