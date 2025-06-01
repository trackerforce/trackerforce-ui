import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-procedure-edit',
  templateUrl: './procedure-edit.component.html',
  styleUrls: ['./procedure-edit.component.scss'],
  standalone: false
})
export class ProcedureEditComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  private _procedureid: string = '';

  loading = true;
  error: string = '';
  procedure$ = new BehaviorSubject<Procedure | null>(null);

  constructor(
    private readonly procedureService: ProcedureService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
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
    this.unsubscribe.next();
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