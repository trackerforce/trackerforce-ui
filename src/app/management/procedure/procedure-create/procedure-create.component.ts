import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { HelperService } from 'src/app/services/helper.service';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-procedure-create',
  templateUrl: './procedure-create.component.html',
  styleUrls: ['./procedure-create.component.scss']
})
export class ProcedureCreateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  procedureSubject: Subject<Procedure> = new Subject();
  procedure!: Procedure;
  error: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private procedureService: ProcedureService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.procedure = new Procedure();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onProcedureChange(procedure: Procedure) {
    this.procedure = procedure;
  }

  onSubmit() {
    const helper: Helper = this.procedure?.helper!;
    const procedure: Procedure = {
      name: this.procedure.name,
      description: this.procedure.description,
      tasks: this.procedure.tasks,
      hook: this.procedure.hook
    }
    
    this.procedureService.createProcedure(procedure, helper).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.snackBar.open(`Procedure created`, 'Close', { duration: 2000 });
        this.procedureSubject.next(task);
        this.onCancel();
      }
    }, error => {
      ConsoleLogger.printError('Failed to create Procedure', error);
      this.error = error.error;
    });
  }

  onCancel() {
    this.helperService.helper.next(undefined);
    this.procedureService.procedure.next(new Procedure());
  }
  
}
