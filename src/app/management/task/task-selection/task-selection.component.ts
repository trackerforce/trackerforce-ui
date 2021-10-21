import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: ['./task-selection.component.scss']
})
export class TaskSelectionComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Output() selectedTask = new EventEmitter<Task>();
  tasks!: Task[];

  error: string = '';
  taskForm = new FormControl();
  filteredOptions!: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.filteredOptions = this.taskForm.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.filter(value || ''))
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
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
    this.selectedTask.emit(this.taskForm.value);
    this.taskForm.reset();
  }

  displayFn(task: Task): string {
    return task && task.description ? task.description : '';
  }

}
