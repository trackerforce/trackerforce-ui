import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Case } from 'src/app/models/case';
import { Procedure } from 'src/app/models/procedure';
import { AgentService } from 'src/app/services/agent.service';
import { SessionService } from 'src/app/services/session.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CaseProcedureComponent } from '../case-procedure/case-procedure.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle, MatDivider, MatCardContent, 
      MatFormField, MatLabel, MatInput, CdkTextareaAutosize, CaseProcedureComponent, AsyncPipe, DatePipe
    ]
})
export class IndexHomeComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly agentService = inject(AgentService);

  private readonly unsubscribe = new Subject();
  private protocol!: string;
  
  loading = true;
  error = '';
  sessionCase$!: Observable<Case | undefined>; 

  constructor() { 
    this.route.params.subscribe(params => this.protocol = params.protocol);
  }

  ngOnInit(): void {
    this.loadCase();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadCase() {
    this.loading = true;
    this.sessionCase$ = this.sessionService.getCase(this.protocol).pipe(
      tap(data => {
        if (data) {
          this.watchCase(data);
        }
        this.loading = false;
      }),
      catchError(error => {
        ConsoleLogger.printError('Failed to load Case', error);
        this.error = 'Case Not Found';
        this.loading = false;
        return of(undefined);
      }),
      takeUntil(this.unsubscribe)
    );
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
    this.loadCase();
  }

  getStatus(sessionCase: Case | undefined) {
    return sessionCase?.procedures
      ?.filter(p => p.status != 'RESOLVED')
      .length ? 'In Progress' : 'Closed';
  }

}
