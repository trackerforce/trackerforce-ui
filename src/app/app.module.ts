import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthService } from './auth/services/auth.service';
import { TokenInterceptor } from './auth/token.interceptor';
import { LoginComponent } from './login/login.component';
import { AppMaterialModule } from './shared/app-material.module';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    AuthGuard,
    AuthService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, 
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
