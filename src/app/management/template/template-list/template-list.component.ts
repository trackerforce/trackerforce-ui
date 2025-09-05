import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  standalone: false
})
export class TemplateListComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly templateService = inject(TemplateService);

  private readonly unsubscribe = new Subject();
  @Input() filter?: Subject<Template>

  displayedColumns: string[] = ['action', 'name'];
  expandedElement = signal<Template | null>(null);
  dataSource$!: Observable<Template[]>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.filter?.pipe(takeUntil(this.unsubscribe)).subscribe(template => this.loadData(template));
    this.templateService.template.pipe(takeUntil(this.unsubscribe)).subscribe(template => this.loadData(template));
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadData(template?: Template) {
    this.dataSource$ = merge(this.sort.sortChange, this.paginator.page).pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let sortBy = '';
          if (this.sort.active) {
            sortBy = `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`;
          }

          return this.templateService.listTemplates(template, { 
            size: this.paginator.pageSize, 
            page: this.paginator.pageIndex,
            sortBy
          }).pipe(takeUntil(this.unsubscribe))
        }),
        map(data => {
          this.loading = false;
          if (data === null)
            return [];

          this.resultsLength = data.items;
          return data.data;
        })
      );
  }

  getColumns(): string[] {
    return this.displayedColumns.filter(col => !col.startsWith('action'));
  }

  getTemplateEdit(templateid: string): string {
    return `/${this.authService.getManagementOrgPath()}/template/${templateid}`
  }

  onTemplateChanged(selectedTemplate: Template) {
    this.loadData();
  }

  toggleExpanded(element: Template) {
    const currentExpanded = this.expandedElement();

    if (currentExpanded === element) {
      this.expandedElement.set(null);
    } else {
      this.expandedElement.set(element);
    }
  }

  isExpanded(element: Template): boolean {
    return this.expandedElement() === element;
  }

}