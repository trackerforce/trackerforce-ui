import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject } from 'rxjs';
import { delay, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { detailsAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [detailsAnimation]
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Input() filter?: Subject<Task>
  @Input() procedureChild: boolean = false;
  @Input() editable: boolean = false;
  @Input() tasksSubject!: Subject<Task[] | undefined>;
  @Output() removeTask = new EventEmitter<Task>();

  displayedColumns: string[] = ['action', 'description'];
  expandedElement: Task | undefined;
  dataSource!: MatTableDataSource<Task>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) { }

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
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadProcedureData() {
    this.tasksSubject.pipe(takeUntil(this.unsubscribe), delay(0)).subscribe(data => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
        this.resultsLength = data.length;
        this.loading = false;
      }
    });
  }

  private loadData(task?: Task) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.taskService.listTasks(task, {
            size: this.paginator.pageSize,
            page: this.paginator.pageIndex,
            sortBy: `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`
          }).pipe(takeUntil(this.unsubscribe))
        }),
        map(data => {
          this.loading = false;
          if (data === null)
            return [];

          this.resultsLength = data.items;
          return data.data;
        })
      ).subscribe(data => this.dataSource = new MatTableDataSource(data));
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
      
      this.dataSource.data = this.dataSource.data.filter(task => task.id !== selectedTask.id);
      this.dataSource.filter = "";
      this.resultsLength = this.dataSource.data.length;
    }
  }

}

