import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-procedure-list-details',
  templateUrl: './procedure-list-details.component.html',
  styleUrls: ['./procedure-list-details.component.scss']
})
export class ProcedureListDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Input() procedure?: Procedure;
  @Input() editable: boolean = false;

  tasksSubject = new Subject<Task[]>();
  procedureForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private procedureService: ProcedureService,
    private snackBar: MatSnackBar
  ) { }

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
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.procedureForm?.invalid)
      return;

    const procedure: Procedure = {
      id: this.procedure?.id,
      name: this.procedureForm.get('name')?.value,
      description: this.procedureForm.get('description')?.value,
    }

    const helper: Helper = {
      content: this.procedureForm.get('helper_content')?.value,
      renderType: this.procedureForm.get('helper_renderType')?.value
    }

    this.procedureService.updateProcedure(procedure, helper)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(procedure => {
        if (procedure) {
          this.procedure = procedure;
          this.snackBar.open(`Procedure updated`, 'Close', { duration: 2000 });
        }
      }, error => {
        ConsoleLogger.printError('Failed to update Procedure', error);
        this.error = error.error;
      });
  }

}
