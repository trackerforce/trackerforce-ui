import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, RouterLink]
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  
  currentToken = ""
  tenant = "";
  isAgent = false;

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
