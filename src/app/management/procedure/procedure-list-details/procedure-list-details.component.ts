import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { TaskListComponent } from '../../task/task-list/task-list.component';

@Component({
    selector: 'app-procedure-list-details',
    templateUrl: './procedure-list-details.component.html',
    styleUrls: ['./procedure-list-details.component.scss'],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, 
      MatButton, TaskListComponent, DatePipe
    ]
})
export class ProcedureListDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly procedureService = inject(ProcedureService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly unsubscribe = new Subject();

  @Input() procedure?: Procedure;
  @Input() editable = false;
  @Output() procedureChanged = new EventEmitter<Procedure>();

  tasksSubject = new BehaviorSubject<Task[] | undefined>(undefined);
  procedureForm!: FormGroup;
  error = '';

  ngOnInit(): void {
    this.procedureForm = this.formBuilder.group({
      name: [this.procedure?.name, Validators.required],
      description: [this.procedure?.description, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.tasksSubject.next(this.procedure?.tasks);
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.procedureForm?.invalid)
      return;

    const updatedProcedure: Procedure = {
      id: this.procedure?.id,
      name: this.procedureForm.get('name')?.value,
      description: this.procedureForm.get('description')?.value,
    }

    this.procedureService.updateProcedure(updatedProcedure)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (procedure: Procedure) => {
          this.procedure = procedure;
          this.procedureChanged.emit(procedure);
          this.snackBar.open(`Procedure updated`, 'Close', { duration: 2000 });
        },
        error: error => {
          ConsoleLogger.printError('Failed to update Procedure', error);
          this.error = error.error;
        }
      });
  }

}
