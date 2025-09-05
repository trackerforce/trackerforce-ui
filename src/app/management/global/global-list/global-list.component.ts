import { AfterViewInit, Component, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Global } from 'src/app/models/global';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-global-list',
  templateUrl: './global-list.component.html',
  styleUrls: ['./global-list.component.scss'],
  standalone: false
})
export class GlobalListComponent implements AfterViewInit, OnDestroy {
  private readonly globalService = inject(GlobalService);

  private readonly unsubscribe = new Subject();

  displayedColumns: string[] = ['description'];
  expandedElement = signal<Global | null>(null);
  dataSource$!: Observable<Global[]>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.globalService.global.pipe(takeUntil(this.unsubscribe)).subscribe(global => this.loadData(global));

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadData(global?: Global) {
    this.dataSource$ = merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.loading = true;
        let sortBy = '';
        if (this.sort.active) {
          sortBy = `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`;
        }
        
        return this.globalService.listGlobals(global, { 
          size: this.paginator.pageSize, 
          page: this.paginator.pageIndex,
          sortBy
        }).pipe(takeUntil(this.unsubscribe))
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

  toggleExpanded(element: Global) {
    const currentExpanded = this.expandedElement();

    if (currentExpanded === element) {
      this.expandedElement.set(null);
    } else {
      this.expandedElement.set(element);
    }
  }

  isExpanded(element: Global): boolean {
    return this.expandedElement() === element;
  }

}

