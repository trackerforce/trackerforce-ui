import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: ['./task-selection.component.scss'],
  standalone: false
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
