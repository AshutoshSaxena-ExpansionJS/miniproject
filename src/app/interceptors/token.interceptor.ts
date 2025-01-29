import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiServiceService } from '../services/api-service.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error?.code === 'token_not_valid') {
          // Token is expired, try to refresh it
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            return this.apiService.refreshToken(refreshToken).pipe(
              switchMap((response: any) => {
                localStorage.setItem('access_token', response.access);
                // Clone the original request and set the new access token
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.access}`
                  }
                });
                return next.handle(newReq);
              }),
              catchError((refreshError) => {
                // If refresh token also fails, logout the user or handle accordingly
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return throwError(refreshError);
              })
            );
          }
        }
        return throwError(error);
      })
    );
  }
}