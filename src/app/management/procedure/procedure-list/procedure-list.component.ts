import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { detailsAnimation, fadeAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss'],
  animations: [detailsAnimation, fadeAnimation]
})
export class ProcedureListComponent implements AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  displayedColumns: string[] = ['action_edit', 'name'];
  expandedElement: Procedure | undefined;
  data: Procedure[] = [];

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private procedureService: ProcedureService
  ) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.procedureService.procedure.pipe(takeUntil(this.unsubscribe)).subscribe(procedure => this.loadData(procedure));

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadData(procedure?: Procedure) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.procedureService.listProcedures(procedure, { 
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
      ).subscribe(data => this.data = data);
  }

  getColumns(): string[] {
    return this.displayedColumns.filter(col => !col.startsWith('action'));
  }

  getTaskEdit(taskid: string): string {
    return `/${this.authService.getManagementOrgPath()}/procedure/${taskid}`
  }

}