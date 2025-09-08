import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatDivider } from '@angular/material/divider';
import { AgentCreateComponent } from '../agent-create/agent-create.component';
import { AgentSearchComponent } from '../agent-search/agent-search.component';
import { AgentListComponent } from '../agent-list/agent-list.component';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss'],
    imports: [MatDivider, AgentCreateComponent, AgentSearchComponent, AgentListComponent]
})
export class AgentsComponent {
  private readonly authService = inject(AuthService);

  isAgent() {
    return this.authService.hasRole('AGENT');
  }

}
