import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
  standalone: false
})
export class TaskEditComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  private _taskid: string = '';

  loading = true;
  error: string = '';
  task = new Task();

  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { 
    this.route.params.subscribe(params => this._taskid = params.taskid);
  }

  ngOnInit(): void {
    this.loading = true;
    this.taskService.getTask(this._taskid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: task => {
          if (task) {
            this.task = task;
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
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onTaskChange(task: Task) {
    this.task = task;
  }

  onSubmit() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/tasks`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/tasks`]);
  }

  hasOptions(): boolean {
    return this.task.options ? this.task.options.length > 0 : false;
  }

}