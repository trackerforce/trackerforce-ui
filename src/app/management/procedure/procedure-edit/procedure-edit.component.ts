import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { ProcedureDetailComponent } from '../procedure-detail/procedure-detail.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-procedure-edit',
    templateUrl: './procedure-edit.component.html',
    styleUrls: ['./procedure-edit.component.scss'],
    imports: [MatProgressSpinner, MatDivider, MatCard, MatCardHeader, MatCardTitle, 
      MatCardContent, ProcedureDetailComponent, MatButton, AsyncPipe
    ]
})
export class ProcedureEditComponent implements OnInit, OnDestroy {
  private readonly procedureService = inject(ProcedureService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly unsubscribe = new Subject();
  private _procedureid = '';

  loading = true;
  error = '';
  procedure$ = new BehaviorSubject<Procedure | null>(null);

  constructor() {
    this.route.params.subscribe(params => this._procedureid = params.procedureid);
  }

  ngOnInit(): void {
    this.loading = true;
    this.procedureService.getProcedure(this._procedureid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (procedure: Procedure) => {
          this.procedure$.next(procedure);
          this.loading = false;
        },
        error: error => {
          ConsoleLogger.printError('Failed to load Procedure', error);
          this.error = error.error;
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onProcedureChange(procedure: Procedure) {
    this.procedure$.next(procedure);
  }

  onSubmit() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/procedures`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/procedures`]);
  }

}