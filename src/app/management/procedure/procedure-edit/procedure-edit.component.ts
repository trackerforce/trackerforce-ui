import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-procedure-edit',
  templateUrl: './procedure-edit.component.html',
  styleUrls: ['./procedure-edit.component.scss']
})
export class ProcedureEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private _procedureid: string = '';

  loading = true;
  error: string = '';
  procedure = new Procedure();

  constructor(
    private procedureService: ProcedureService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => this._procedureid = params.procedureid);
  }

  ngOnInit(): void {
    this.loading = true;
    this.procedureService.getProcedure(this._procedureid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(procedure => {
        if (procedure)
          this.procedure = procedure;

        this.loading = false;
      }, error => {
        ConsoleLogger.printError('Failed to load Procedure', error);
        this.error = error.error;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onProcedureChange(procedure: Procedure) {
    this.procedure = procedure;
  }

  onSubmit() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/procedures`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/procedures`]);
  }

}