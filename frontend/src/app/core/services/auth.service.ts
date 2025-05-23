import {Injectable} from '@angular/core';
import {BehaviorSubject, delay, map, Observable, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LoginApiResponse, LoginRequest, LoginResponse} from '../interfaces/login-interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public static accessTokenKey = 'accessToken';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    // Здесь должна быть реальная авторизация
    return this.http.post<LoginApiResponse>(
      `${environment.apiUrl}/auth/login`, request
    ).pipe(
      map(response => ({
         accessToken: response.access_token
      }) as LoginResponse),
      tap(response => {
        localStorage.setItem(AuthService.accessTokenKey, response.accessToken)
      })
    )
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
}
