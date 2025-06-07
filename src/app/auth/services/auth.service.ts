import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { AuthAccess } from '../models/auth-access';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly jwtHelper = inject(JwtHelperService);

  @Output() logoff = new EventEmitter();
  @Output() releaseOldSessions = new EventEmitter();

  public static readonly USER_INFO = 'USER_INFO';
  public static readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  private readonly currentTokenSubject: BehaviorSubject<string>;
  public readonly currentToken: Observable<string>;

  private readonly userInfoSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  loggedUser = "";

  constructor() {
    this.currentTokenSubject = new BehaviorSubject<string>(localStorage.getItem(AuthService.JWT_TOKEN) ?? "");
    this.currentToken = this.currentTokenSubject.asObservable();

    this.userInfoSubject = new BehaviorSubject<any>(localStorage.getItem(AuthService.USER_INFO));
    this.currentUser = this.userInfoSubject.asObservable();
  }

  login(user: { email: string, password: string }): Observable<boolean> {
    return this.http.post<AuthAccess>(`${environment.identityServiceUrl}/identity/v1/authenticate`, user)
      .pipe(
        tap(auth => {
          this.doLoginUser(auth);
          this.currentTokenSubject.next(auth.token);
          this.setUserInfo('access', 'root');
        }),
        map(() => true),
        catchError(this.handleError));
  }

  loginAgent(user: { email: string, password: string }, tenant: string): Observable<boolean> {
    return this.http.post<AuthAccess>(`${environment.identityServiceUrl}/identity/agent/v1/authenticate`, user, {
      headers: {
        'X-Tenant': tenant
      }
    })
      .pipe(
        tap(auth => {
          this.doLoginUser(auth, tenant);
          this.currentTokenSubject.next(auth.token);
          this.setUserInfo('tenant', tenant);
          this.setUserInfo('access', 'agent');
        }),
        map(() => true),
        catchError(this.handleError));
  }

  signup(user: { email: string, password: string }, organization: string): Observable<boolean> {
    return this.http.post<any>(`${environment.identityServiceUrl}/identity/v1/register`, {
      email: user.email,
      password: user.password,
      organization: {
        name: organization
      }
    })
      .pipe(
        tap(signup => signup != undefined),
        map(() => true),
        catchError(this.handleError));
  }

  signupAgent(user: { email: string, password: string, access_code: string }, organization: string): Observable<boolean> {
    return this.http.post<any>(`${environment.identityServiceUrl}/identity/agent/v1/activate`, {
      email: user.email,
      password: user.access_code,
      new_password: user.password
    }, { headers: {  'X-Tenant': organization } })
      .pipe(
        tap(signup => signup != undefined),
        map(() => true),
        catchError(this.handleError));
  }

  cleanSession() {
    this.currentTokenSubject.next("");
    this.doLogoutUser();
  }

  logout() {
    this.http.post<any>(`${environment.identityServiceUrl}/identity/v1/logout`, {}).subscribe(_ => {
      this.currentTokenSubject.next("");
      this.doLogoutUser();
    });
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(`${environment.identityServiceUrl}/identity/v1/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap({
        next: (auth: AuthAccess) => {
          this.storeTokens(auth);
          this.currentTokenSubject.next(auth.token);
        },
        error: () => this.cleanSession()
      })
    );
  }

  isAlive(): Observable<any> {
    return this.http.get<any>(`${environment.identityServiceUrl}/check`).pipe(catchError(this.handleError));
  }

  getJwtToken() {
    return localStorage.getItem(AuthService.JWT_TOKEN);
  }

  setUserInfo(key: string, value: string): void {
    if (localStorage.getItem(AuthService.USER_INFO)) {
      const userData = JSON.parse(localStorage.getItem(AuthService.USER_INFO) ?? "");
      userData[key] = value;

      localStorage.setItem(AuthService.USER_INFO, JSON.stringify(userData));
      this.userInfoSubject.next(userData);
    }
  }

  getUserInfo(key: string): string {
    if (localStorage.getItem(AuthService.USER_INFO))
      return JSON.parse(localStorage.getItem(AuthService.USER_INFO) ?? "")[`${key}`];
    return "";
  }

  getManagementOrgPath(): string {
    return `/management/${this.getUserInfo('tenant')}`;
  }

  getSessionOrgPath(): string {
    return `/session/${this.getUserInfo('tenant')}`;
  }

  hasRole(role: string) {
    const token = localStorage.getItem(AuthService.JWT_TOKEN);

    if (!token)
      return true;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return (decodedToken.roles as string[]).filter(r => r === role).length > 0;
  }

  private handleError(result: any) {
    let errorMessage = '';
    if (result.error instanceof ErrorEvent) {
      errorMessage = `Error: ${result.error.message}`;
    } else if (result.status === 401 || result.status === 422) {
      errorMessage = 'Invalid username/password';
    } else if (result.status === 400) {
      errorMessage = result.error.error;
    } else {
      ConsoleLogger.printError(result);
      errorMessage = `Trackerforce is offline`;
    }
    return throwError(() => errorMessage);
  }

  private doLoginUser(auth: AuthAccess, tenant?: string) {
    const userData = JSON.stringify({
      name: auth.access.email,
      tenant: tenant ?? auth.access.organization.name,
      sessionid: auth.access.id
    });

    localStorage.setItem(AuthService.USER_INFO, userData);
    this.userInfoSubject.next(userData);
    this.loggedUser = auth.access.email;
    this.storeTokens(auth);
  }

  private doLogoutUser() {
    this.loggedUser = "";
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeTokens(auth: AuthAccess) {
    localStorage.setItem(AuthService.JWT_TOKEN, auth.token);
    localStorage.setItem(this.REFRESH_TOKEN, auth.refreshToken);
  }

  private removeTokens() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
