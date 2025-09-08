import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { AgentService } from 'src/app/services/agent.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle, MatCardSmImage, MatCardContent } from '@angular/material/card';
import { MyCasesComponent } from '../my-cases/my-cases.component';

@Component({
    selector: 'app-index-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle, MatCardSmImage, MatCardContent, MyCasesComponent]
})
export class IndexHomeComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly agentServie = inject(AgentService);

  private readonly unsubscribe = new Subject();

  agent?: Agent;

  ngOnInit(): void {
    if (this.isAgent()) {
      this.loadAgent();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadAgent() {
    this.agentServie.getMe().pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: agent => {
          this.agent = agent;
        },
        error: error => {
          ConsoleLogger.printError('Failed to fetch Agent', error);
        }
      });
  }

  getInfo(key: string) {
    return this.authService.getUserInfo(key);
  }

  isAgent() {
    return this.authService.hasRole('AGENT');
  }

}
