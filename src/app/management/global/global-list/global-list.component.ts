import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Global } from 'src/app/models/global';
import { GlobalService } from 'src/app/services/global.service';
import { detailsAnimation, fadeAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-global-list',
  templateUrl: './global-list.component.html',
  styleUrls: ['./global-list.component.scss'],
  animations: [detailsAnimation, fadeAnimation]
})
export class GlobalListComponent implements AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  displayedColumns: string[] = ['description'];
  expandedElement: Global | undefined;
  data: Global[] = [];

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private globalService: GlobalService
  ) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.globalService.global.pipe(takeUntil(this.unsubscribe)).subscribe(global => this.loadData(global));

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadData(global?: Global) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.globalService.listGlobals(global, { 
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

}

