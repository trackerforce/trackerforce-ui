import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { detailsAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  animations: [detailsAnimation]
})
export class TemplateListComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  @Input() filter?: Subject<Template>

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

  ngOnInit(): void {
    this.filter?.pipe(takeUntil(this.unsubscribe)).subscribe(template => this.loadData(template));
    this.templateService.template.pipe(takeUntil(this.unsubscribe)).subscribe(template => this.loadData(template));
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
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

  onTemplateChanged(selectedTemplate: Template) {
    for (const iterator of this.dataSource.data) {
      if (iterator.id === selectedTemplate.id) {
        iterator.name = selectedTemplate.name;
        iterator.description = selectedTemplate.description;
        break;
      }
    }
  }

}