import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Case } from 'src/app/models/case';
import { Procedure } from 'src/app/models/procedure';
import { AgentService } from 'src/app/services/agent.service';
import { SessionService } from 'src/app/services/session.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class IndexHomeComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  private protocol!: string;
  
  loading = true;
  error: string = '';
  sessionCase?: Case;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly agentService: AgentService
  ) { 
    this.route.params.subscribe(params => this.protocol = params.protocol);
  }

  ngOnInit(): void {
    this.loadCase();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadCase() {
    this.loading = true;
    this.sessionService.getCase(this.protocol)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: data => {
          if (data) {
            this.sessionCase = data;
            this.watchCase(data);
          }
        },
        error: error => {
          ConsoleLogger.printError('Failed to load Case', error);
          this.error = 'Case Not Found';
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  watchCase(sessionCase: Case) {
    const sessionid = this.authService.getUserInfo('sessionid');
    this.agentService.watchCase(sessionid, sessionCase.id!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: error => ConsoleLogger.printError('Failed to watch Case', error)
      });
  }

  onProcedureChanged(procedure: Procedure) {
    let found = false;
    if (!this.sessionCase?.procedures) return;
    
    for (const it of this.sessionCase.procedures) {
      if (it.id == procedure.id) {
        it.status = procedure.status;
        it.tasks = procedure.tasks;
        found = true;
        break;
      }
    }

    if (!found)
      this.loadCase();
  }

  getStatus() {
    return this.sessionCase?.procedures
      ?.filter(p => p.status != 'RESOLVED')
      .length ? 'In Progress' : 'Closed';
  }

}
