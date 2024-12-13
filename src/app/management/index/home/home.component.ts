import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { AgentService } from 'src/app/services/agent.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-index-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class IndexHomeComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();

  agent?: Agent;

  constructor(
    private readonly authService: AuthService,
    private readonly agentServie: AgentService
  ) { }

  ngOnInit(): void {
    if (this.isAgent()) {
      this.loadAgent();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
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
