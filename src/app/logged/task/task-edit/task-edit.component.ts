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
  action: string = 'cancel';
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
    this.taskForm = this.formBuilder.group({
      description: ['', Validators.required],
      type: ['', Validators.required],
      options: [''],
      learn: [''],
      hidden: [''],
      helper_content: [''],
      helper_rendertype: ['']
    });

    this.taskService.getTask(this._taskid).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.task = task;
        this.taskForm.get('description')?.setValue(this.task.description);
        this.taskForm.get('type')?.setValue(this.task.type);
        this.taskForm.get('options')?.setValue(this.task.options?.map(opt => opt.value));
        this.taskForm.get('learn')?.setValue(this.task.learn);
        this.taskForm.get('hidden')?.setValue(this.task.hidden);
        this.taskForm.get('helper_content')?.setValue(this.task.helper?.content);
        this.taskForm.get('helper_rendertype')?.setValue(this.task.helper?.renderType);
      }
    }, error => {
      ConsoleLogger.printError('Failed to load Agent', error);
      this.error = error;
    }, () => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(action: string) {
    if (this.taskForm?.invalid)
      return;

    return this.router.navigate([`${this.authService.getUserInfo('tenant')}/tasks`]);
  }

  hasOptions(): boolean {
    return this.taskForm.get('options')?.value;
  }

}