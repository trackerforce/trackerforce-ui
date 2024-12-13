import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  
  currentToken: String = "";
  tenant: String = "";

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentToken.subscribe(token => {
      this.tenant = this.authService.getUserInfo('tenant');
      this.currentToken = token;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  isAgent() {
    return this.authService.hasRole('AGENT');
  }
}
