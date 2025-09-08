import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-task-selection',
    templateUrl: './task-selection.component.html',
    styleUrls: ['./task-selection.component.scss'],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, MatAutocomplete, 
      MatOption, MatButton, AsyncPipe
    ]
})
export class TaskSelectionComponent implements OnInit, OnDestroy {
  private readonly taskService = inject(TaskService);

  private readonly unsubscribe = new Subject();

  @Output() selectedTask = new EventEmitter<Task>();
  tasks!: Task[];

  error = '';
  taskForm = new FormControl();
  filteredOptions!: Observable<Task[]>;

  ngOnInit(): void {
    this.filteredOptions = this.taskForm.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.filter(value ?? ''))
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private filter(value: string): Observable<Task[]> {
    return this.taskService.listTasks({ description: value })
      .pipe(
        takeUntil(this.unsubscribe),
        map(response => response.data)
      )
  }

  onSubmit() {
    if (this.taskForm.value) {
      this.selectedTask.emit(this.taskForm.value);
      this.taskForm.reset();
    }
  }

  displayFn(task: Task): string {
    return task?.description ?? '';
  }

}
