import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss'],
    imports: [MatProgressSpinner, MatDivider, MatCard, MatCardHeader, MatCardTitle, 
      MatCardContent, TaskDetailComponent, MatButton, AsyncPipe
    ]
})
export class TaskEditComponent implements OnInit, OnDestroy {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly unsubscribe = new Subject();
  private _taskid = '';

  loading = true;
  error = '';
  task$ = new BehaviorSubject<Task | null>(null);

  constructor() { 
    this.route.params.subscribe(params => this._taskid = params.taskid);
  }

  ngOnInit(): void {
    this.loading = true;
    this.taskService.getTask(this._taskid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: task => {
          if (task) {
            this.task$.next(task);
            this.loading = false;
          }
        },
        error: error => {
          ConsoleLogger.printError('Failed to load Task', error);
          this.error = error.error;
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onTaskChange(task: Task) {
    this.task$.next(task);
  }

  onSubmit() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/tasks`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/tasks`]);
  }

  hasOptions(task: Task | null): boolean {
    return !!task?.options?.length;
  }

}