import { Injectable, OnDestroy } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor, OnDestroy {

  private isRefreshing = false;
  private readonly refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private readonly authService: AuthService, private readonly router: Router) { 
    this.authService.releaseOldSessions.subscribe(() => {
      this.isRefreshing = false;
    })
  }

  ngOnDestroy(): void {
    this.authService.releaseOldSessions.unsubscribe();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getJwtToken()) {
      request = this.setHeader(request, this.authService.getJwtToken() || "");
    }
    
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 
        && request.url !== `${environment.identityServiceUrl}/identity/agent/v1/activate`
        && request.url !== `${environment.identityServiceUrl}/identity/agent/v1/authenticate`
        && request.url !== `${environment.identityServiceUrl}/identity/v1/register`
        && request.url !== `${environment.identityServiceUrl}/identity/v1/authenticate`
        && request.url !== `${environment.identityServiceUrl}/identity/v1/refresh`) {
        return this.handle401Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private setHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-Tenant': this.authService.getUserInfo('tenant')
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.token);
          return next.handle(this.setHeader(request, token.token));
        }),
        catchError((error) => {
          this.router.navigate(['/login']);
          return throwError(error);
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.setHeader(request, jwt));
        }));
    }
  }
}
