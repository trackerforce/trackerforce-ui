import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TaskListComponent implements AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  displayedColumns: string[] = ['action_edit', 'description'];
  expandedElement: Task | undefined;
  data: Task[] = [];

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.taskService.task.pipe(takeUntil(this.unsubscribe)).subscribe(task => this.loadData(task))

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadData(task?: Task) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.taskService.listTasks(task, { 
            size: this.paginator.pageSize, 
            page: this.paginator.pageIndex 
          }).pipe(takeUntil(this.unsubscribe))
        }),
        map(data => {
          this.loading = false;
          if (data === null)
            return [];

          this.resultsLength = data.items;
          return data.data;
        })
      ).subscribe(data => this.data = data);
  }

  getColumns(): string[] {
    return this.displayedColumns.filter(col => !col.startsWith('action'));
  }

  getTaskEdit(taskid: string): string {
    return `/${this.authService.getManagementOrgPath()}/task/${taskid}`
  }

}

