import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  taskCreateExpanded: boolean = false;
  taskForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      description: ['', Validators.required],
      type: ['', Validators.required],
      learn: [''],
      hidden: [''],
      helper_content: [''],
      helper_rendertype: ['']
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.taskForm?.invalid)
      return;

    const task: Task = {
      description: this.taskForm.get('description')?.value,
      type: this.taskForm.get('type')?.value.value,
      learn: this.taskForm.get('learn')?.value,
      hidden: this.taskForm.get('hidden')?.value
    }

    const helper: Helper = {
      content: this.taskForm.get('helper_content')?.value,
      renderType: this.taskForm.get('helper_rendertype')?.value
    }

    this.taskService.createTask(task, helper).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.snackBar.open(`Task created`, 'Close', { duration: 2000 });
        this.taskService.task.next(undefined);
        this.taskForm.reset();
      }
    }, error => {
      ConsoleLogger.printError('Failed to create Task', error);
      this.error = error;
    });
  }

  onTypeChange() {
    if (this.taskForm.get('type')?.value.learn)
      this.taskForm.get('learn')?.enable();
    else {
      this.taskForm.get('learn')?.disable();
      this.taskForm.get('learn')?.setValue(false);
    }
  }
}

const taskTypes = [
  {
    name: 'Plain text',
    value: 'TEXT',
    learn: false
  }, {
    name: 'Plain multiline text',
    value: 'MULTILINE_TEXT',
    learn: false
  }, {
    name: 'Number',
    value: 'NUMBER',
    learn: true
  }, {
    name: 'Checkbox',
    value: 'CHECK',
    learn: true
  }, {
    name: 'Radio',
    value: 'RADIO',
    learn: true
  }, {
    name: 'Drilldown',
    value: 'DRILLDOWN',
    learn: true
  }
]
