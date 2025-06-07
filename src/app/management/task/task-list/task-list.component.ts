import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { delay, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { detailsAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [detailsAnimation],
  standalone: false
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);

  private readonly unsubscribe = new Subject();

  @Input() filter?: Subject<Task>
  @Input() procedureChild = false;
  @Input() editable = false;
  @Input() tasksSubject!: BehaviorSubject<Task[] | undefined>;
  @Output() removeTask = new EventEmitter<Task>();

  displayedColumns: string[] = ['action', 'description'];
  expandedElement: Task | undefined;
  dataSource$!: Observable<Task[]>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.filter?.pipe(takeUntil(this.unsubscribe)).subscribe(task => this.loadData(task));
    this.taskService.task.pipe(takeUntil(this.unsubscribe)).subscribe(task => this.loadData(task));
    
    if (this.procedureChild)
      this.loadProcedureData();
  }

  ngAfterViewInit(): void {
    if (!this.procedureChild) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadProcedureData() {
    this.dataSource$ = this.tasksSubject.pipe(
      takeUntil(this.unsubscribe),
      delay(0),
      map(data => {
        this.resultsLength = data?.length ?? 0;
        this.loading = false;
        return data ?? [];
      })
    );
  }

  private loadData(task?: Task) {
    this.dataSource$ = merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.loading = true;
        let sortBy = '';
        if (this.sort.active) {
          sortBy = `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`;
        }
        
        return this.taskService.listTasks(task, {
          size: this.paginator.pageSize,
          page: this.paginator.pageIndex,
          sortBy,
        }).pipe(takeUntil(this.unsubscribe));
      }),
      map(data => {
        this.loading = false;
        if (data === null) return [];
        this.resultsLength = data.items;
        return data.data;
      })
    );
  }

  getColumns(): string[] {
    return this.displayedColumns.filter(col => !col.startsWith('action'));
  }

  getTaskEdit(taskid: string): string {
    return `/${this.authService.getManagementOrgPath()}/task/${taskid}`
  }

  onRemove(event: Event, selectedTask: Task) {
    event.stopPropagation();

    if (this.procedureChild) {
      this.removeTask.emit(selectedTask);
      
      const current = this.tasksSubject.value ?? [];
      this.tasksSubject.next(current.filter(task => task.id !== selectedTask.id));
      this.resultsLength--;
    }
  }

}

