import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { HelperService } from 'src/app/services/helper.service';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { ProcedureDetailComponent } from '../procedure-detail/procedure-detail.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-procedure-create',
    templateUrl: './procedure-create.component.html',
    styleUrls: ['./procedure-create.component.scss'],
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, 
      MatExpansionPanelDescription, ProcedureDetailComponent, MatButton
    ]
})
export class ProcedureCreateComponent implements OnInit, OnDestroy {
  private readonly snackBar = inject(MatSnackBar);
  private readonly procedureService = inject(ProcedureService);
  private readonly helperService = inject(HelperService);

  private readonly unsubscribe = new Subject();

  procedureSubject = new Subject();
  procedure!: Procedure;
  error = '';

  ngOnInit(): void {
    this.procedure = new Procedure();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onProcedureChange(procedure: Procedure) {
    this.procedure = procedure;
  }

  onSubmit() {
    const helper: Helper = this.procedure.helper!;
    const procedure: Procedure = {
      name: this.procedure.name,
      description: this.procedure.description,
      tasks: this.procedure.tasks,
      hook: this.procedure.hook
    }
    
    this.procedureService.createProcedure(procedure, helper).pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (task) => {
          if (task) {
            this.snackBar.open(`Procedure created`, 'Close', { duration: 2000 });
            this.procedureSubject.next(task);
            this.onCancel();
          }
        },
        error: (error) => {
          ConsoleLogger.printError('Failed to create Procedure', error);
          this.error = error.error;
        }
      });
  }

  onCancel() {
    this.helperService.helper.next(undefined);
    this.procedureService.procedure.next(new Procedure());
  }
  
}
