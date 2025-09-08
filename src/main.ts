import { enableProdMode, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import '@angular/compiler';

import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AuthGuard } from './app/auth/guards/auth.guard';
import { AuthService } from './app/auth/services/auth.service';
import { TokenInterceptor } from './app/auth/token.interceptor';

if (environment.production) {
  enableProdMode();
}

const routes = [
  { path: '', 
    loadComponent: () => import('./app/home/home.component').then(mod => mod.HomeComponent) 
  },
  { path: 'login', 
    loadComponent: () => import('./app/login/login.component').then(mod => mod.LoginComponent) 
  },
  { path: 'signup', 
    loadComponent: () => import('./app/signup/signup.component').then(mod => mod.SignupComponent) 
  },
  {
    path: 'management/:tenant',
    loadChildren: () => import('./app/management/management.module').then(mod => mod.ManagementModule)
  },
  {
    path: 'session/:tenant',
    loadChildren: () => import('./app/session/session.module').then(mod => mod.SessionModule)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    AuthGuard,
    AuthService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
  ]
}).catch(err => console.error(err));
