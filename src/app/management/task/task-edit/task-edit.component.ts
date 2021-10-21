import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private _taskid: string = '';

  loading = true;
  taskForm!: FormGroup;
  error: string = '';
  task?: Task = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.route.params.subscribe(params => this._taskid = params.taskid);
  }

  ngOnInit(): void {
    this.loading = true;

    this.taskForm = this.formBuilder.group({});
    this.taskService.getTask(this._taskid).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.task = task;
        this.taskForm = this.formBuilder.group({
          description: [this.task.description, Validators.required],
          type: [this.task.type, Validators.required],
          options: [this.task.options?.map(opt => opt.value)],
          learn: [this.task.learn],
          hidden: [this.task.hidden],
          helper_content: [this.task.helper?.content],
          helper_renderType: [this.task.helper?.renderType]
        });
      }
    }, error => {
      ConsoleLogger.printError('Failed to load Task', error);
      this.error = error;
    }, () => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.taskForm?.invalid)
      return;
      
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/tasks`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/tasks`]);
  }

  hasOptions(): boolean {
    return this.taskForm.get('options')?.value;
  }

}