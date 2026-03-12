import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const skipUrls = [
      '/api/users/Login',
      '/api/users/SignUp'
    ];

    const shouldSkip = skipUrls.some(url => req.url.includes(url));

    let authReq = req;

    if (token && !shouldSkip) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
