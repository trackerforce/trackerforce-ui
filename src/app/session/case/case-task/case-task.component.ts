import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-case-task',
  templateUrl: './case-task.component.html',
  styleUrls: ['./case-task.component.scss'],
  standalone: false
})
export class CaseTaskComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);

  private readonly unsubscribe = new Subject();

  @Input() task!: Task;
  @Input() open = true;
  @Output() eventChange = new EventEmitter<Task>();

  iconClass = "";
  taskForm!: FormGroup;
  type = "TEXT";

  ngOnInit(): void {
    this.type = this.task.type!;
    this.task.response = this.defaultResponse();

    this.taskForm = this.formBuilder.group({
      response: [this.task.response, Validators.required]
    });

    this.taskForm.valueChanges.pipe(takeUntil(this.unsubscribe), debounceTime(500))
      .subscribe(data => {
        if (data?.response != undefined) {
          this.task.response = data.response;
          this.eventChange.emit(this.task);
          this.iconClass = "task-done";
        } else {
          this.task.response = undefined;
          this.eventChange.emit(this.task);
          this.iconClass = "";
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private defaultResponse() {
    if (this.isTaskDone())
      this.iconClass = "task-done";

    if (this.task.type === 'CHECK')
      return this.task.response ?? false;

    return this.task.response;
  }

  isTaskDone() {
    return this.task.response != undefined;
  }

}
