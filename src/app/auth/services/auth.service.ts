import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { AuthAccess } from '../models/auth-access';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() logoff: EventEmitter<String> = new EventEmitter();
  @Output() releaseOldSessions: EventEmitter<any> = new EventEmitter();

  public static readonly USER_INFO = 'USER_INFO';
  public static readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  private currentTokenSubject: BehaviorSubject<String>;
  public currentToken: Observable<String>;

  private userInfoSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  loggedUser: string = "";

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject<String>(localStorage.getItem(AuthService.JWT_TOKEN) || "");
    this.currentToken = this.currentTokenSubject.asObservable();

    this.userInfoSubject = new BehaviorSubject<any>(localStorage.getItem(AuthService.USER_INFO));
    this.currentUser = this.userInfoSubject.asObservable();
  }

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<AuthAccess>(`${environment.apiUrl}/identity/v1/authenticate`, user)
      .pipe(
        tap(auth => {
          this.doLoginUser(auth);
          this.currentTokenSubject.next(auth.token);
        }),
        mapTo(true),
        catchError(this.handleError));
  }

  signup(user: { name: string, email: string, password: string, token: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/identity/v1/register`, user)
      .pipe(
        tap(signup => signup != undefined),
        mapTo(true),
        catchError(this.handleError));
  }

  cleanSession() {
    this.currentTokenSubject.next("");
    this.doLogoutUser();
  }

  logout(deleted: boolean = false) {
    if (!deleted) {
      this.http.post<any>(`${environment.apiUrl}/identity/v1/logout`, null).subscribe();
    }
    this.currentTokenSubject.next("");
    this.doLogoutUser();
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(`${environment.apiUrl}/identity/v1/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap((auth: AuthAccess) => this.storeTokens(auth), 
      () => this.cleanSession()));
  }

  isAlive(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/check`).pipe(catchError(this.handleError));
  }

  getJwtToken() {
    return localStorage.getItem(AuthService.JWT_TOKEN);
  }

  setUserInfo(key: string, value: string): void {
    if (localStorage.getItem(AuthService.USER_INFO)) {
      const userData = JSON.parse(localStorage.getItem(AuthService.USER_INFO) || "");
      userData[`${key}`] = value;
      localStorage.setItem(AuthService.USER_INFO, JSON.stringify(userData));
      this.userInfoSubject.next(userData);
    }
  }

  getUserInfo(key: string): string {
    if (localStorage.getItem(AuthService.USER_INFO))
      return JSON.parse(localStorage.getItem(AuthService.USER_INFO) || "")[`${key}`];
    return "";
  }

  private handleError(result: any) {
    let errorMessage = '';
    if (result.error instanceof ErrorEvent) {
      errorMessage = `Error: ${result.error.message}`;
    } else {
      if (result.status === 401 || result.status === 422) {
        errorMessage = 'Invalid username/password';
      } else if (result.status === 400) {
        errorMessage = result.error.error;
      } else {
        ConsoleLogger.printError(result);
        errorMessage = `Trackerforce is offline`;
      }
    }
    return throwError(errorMessage);
  }

  private doLoginUser(auth: AuthAccess) {
    const userData = JSON.stringify({ 
      name: auth.access.username,
      sessionid: auth.access.id
    });

    localStorage.setItem(AuthService.USER_INFO, userData);
    this.userInfoSubject.next(userData);
    this.loggedUser = auth.access.username;
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
