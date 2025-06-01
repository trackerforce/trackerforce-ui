import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  
  currentToken = ""
  tenant = "";
  isAgent = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authService.currentToken.subscribe(token => {
      this.tenant = this.authService.getUserInfo('tenant');
      this.isAgent = this.authService.hasRole('AGENT');
      this.currentToken = token;
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
