import { Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-procedure-create',
  templateUrl: './procedure-create.component.html',
  styleUrls: ['./procedure-create.component.scss']
})
export class ProcedureCreateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  procedureForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadForm() {
    this.error = '';
    this.procedureForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      tasks: [[]],
      helper_content: [''],
      helper_renderType: ['PLAINTEXT'],
      hook: []
    });
  }

  onAddTask(task: Task) {
    const tasks: Task[] = this.procedureForm.get('tasks')?.value
    tasks.push(task);
    this.procedureForm.get('tasks')?.setValue(tasks);
  }

  onRemoveTask(task: Task) {
    let tasks: Task[] = this.procedureForm.get('tasks')?.value
    tasks = tasks.filter(t => t.id !== task.id);
    this.procedureForm.get('tasks')?.setValue(tasks);
  }

  onSubmit() {
    if (this.procedureForm?.invalid) {
      this.error = 'Procedure has missing parameters'
      return;
    }

    const procedure: Procedure = {
      name: this.procedureForm.get('name')?.value,
      description: this.procedureForm.get('description')?.value,
      tasks: this.procedureForm.get('tasks')?.value,
      hook: {
        resolverUri: this.procedureForm.get('hook')?.value
      }
    }

    const helper: Helper = {
      content: this.procedureForm.get('helper_content')?.value,
      renderType: this.procedureForm.get('helper_renderType')?.value
    }

    this.procedureService.createProcedure(procedure, helper).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.snackBar.open(`Procedure created`, 'Close', { duration: 2000 });
        this.procedureService.procedure.next(undefined);
        
        this.procedureForm.reset();
        this.loadForm();
      }
    }, error => {
      ConsoleLogger.printError('Failed to create Procedure', error);
      this.error = error;
    });
  }

  onCancel() {
    this.procedureForm.get('tasks')?.setValue([]);
  }
  
}
