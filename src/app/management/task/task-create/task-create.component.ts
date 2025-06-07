import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Task } from 'src/app/models/task';
import { HelperService } from 'src/app/services/helper.service';
import { TaskService } from 'src/app/services/task.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
  standalone: false
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);
  private readonly helperService = inject(HelperService);

  private readonly unsubscribe = new Subject();
  
  taskSubject = new Subject();
  task!: Task;
  error = '';

  ngOnInit(): void {
    this.task = new Task();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onTaskChange(task: Task) {
    this.task = task;
  }

  onSubmit() {
    const helper: Helper = this.task.helper!;
    const newTask: Task = {
      description: this.task.description,
      type: this.task.type,
      learn: this.task.learn,
      hidden: this.task.hidden,
      options: this.task.options
    }

    this.taskService.createTask(newTask, helper)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: task => {
          if (task) {
            this.snackBar.open(`Task created`, 'Close', { duration: 2000 });
            this.taskSubject.next(task);
            this.onCancel();
          }
        },
        error: error => {
          ConsoleLogger.printError('Failed to create Task', error);
          this.error = error.error;
        }
      });
  }

  onCancel() {
    this.helperService.helper.next(undefined);
    this.taskService.task.next(new Task());
  }
  
}
