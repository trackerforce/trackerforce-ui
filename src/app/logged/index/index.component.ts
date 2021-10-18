import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { AgentService } from 'src/app/services/agent.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  agent?: Agent;

  constructor(
    private authService: AuthService,
    private agentServie: AgentService
  ) { }

  ngOnInit(): void {
    if (this.getRole() === 'Agent') {
      this.agentServie.getMe().pipe(takeUntil(this.unsubscribe)).subscribe(agent => {
        if (agent)
          this.agent = agent;
      }, error => {
        ConsoleLogger.printError('Failed to fetch Agent', error);
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getInfo(key: string) {
    return this.authService.getUserInfo(key);
  }

  getRole() {
    return this.getInfo('access') === 'root' ? 'Administrator' : 'Agent';
  }

}
