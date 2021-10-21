import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { detailsAnimation, rowsAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [detailsAnimation, rowsAnimation ]
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  @Input() procedureChild!: boolean;
  @Input() procedureTasks!: Subject<Task[]>;
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
    if (this.procedureChild)
      this.loadProcedureData();
  }

  ngAfterViewInit(): void {
    if (!this.procedureChild) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.taskService.task.pipe(takeUntil(this.unsubscribe)).subscribe(task => this.loadData(task));
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadProcedureData() {
    this.loading = false;
    this.procedureTasks.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.resultsLength = data.length;
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

  onRemove(selectedTask: Task) {
    if (this.procedureChild) {
      this.dataSource = new MatTableDataSource(this.dataSource.data.filter(task => task.id !== selectedTask.id));
      this.resultsLength = this.dataSource.data.length;
      this.removeTask.emit(selectedTask);
    }
  }

}

