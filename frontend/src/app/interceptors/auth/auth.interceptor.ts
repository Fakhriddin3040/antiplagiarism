import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getAuthHeaders();

    if(token) {
      req = req.clone({
        setHeaders: this.getAuthHeaders()
      })
    }
      return next.handle(req);
  }

  getAuthHeaders(): {Authorization: string } {
    const token = localStorage.getItem('accessToken') || '';
    return {
      Authorization: `Bearer ${token}`
    }
  }

}
