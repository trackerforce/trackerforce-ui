import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  standalone: false
})
export class AgentsComponent {
  private readonly authService = inject(AuthService);

  isAgent() {
    return this.authService.hasRole('AGENT');
  }

}
