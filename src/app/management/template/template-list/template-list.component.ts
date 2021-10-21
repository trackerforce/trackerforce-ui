import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { detailsAnimation, fadeAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  animations: [detailsAnimation, fadeAnimation]
})
export class TemplateListComponent implements AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  displayedColumns: string[] = ['action', 'name'];
  expandedElement: Template | undefined;
  dataSource!: MatTableDataSource<Template>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private templateService: TemplateService
  ) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.templateService.template.pipe(takeUntil(this.unsubscribe)).subscribe(template => this.loadData(template));

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadData(template?: Template) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.templateService.listTemplates(template, { 
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

  getTemplateEdit(templateid: string): string {
    return `/${this.authService.getManagementOrgPath()}/template/${templateid}`
  }

}