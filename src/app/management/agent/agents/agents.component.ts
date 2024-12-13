import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  standalone: false
})
export class AgentsComponent {

  constructor(
    private readonly authService: AuthService
  ) {
  }

  isAgent() {
    return this.authService.hasRole('AGENT');
  }

}
