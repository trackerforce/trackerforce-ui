import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject } from 'rxjs';
import { delay, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
export class ProcedureListComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  @Input() templateChild!: boolean;
  @Input() templateProcedures!: Subject<Procedure[]>;
  @Output() removeProcedure = new EventEmitter<Procedure>();

  displayedColumns: string[] = ['action', 'name'];
  expandedElement: Procedure | undefined;
  dataSource!: MatTableDataSource<Procedure>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    if (this.templateChild)
      this.loadTemplateData();
  }

  ngAfterViewInit(): void {
    if (!this.templateChild) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.procedureService.procedure.pipe(takeUntil(this.unsubscribe)).subscribe(procedure => this.loadData(procedure));
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadTemplateData() {
    this.templateProcedures.pipe(takeUntil(this.unsubscribe), delay(0)).subscribe(data => {
      if (data) {
        this.loading = false;
        this.dataSource = new MatTableDataSource(data);
        this.resultsLength = data.length;
      }
    });
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
        ).subscribe(data => this.dataSource = new MatTableDataSource(data));
  }

  getColumns(): string[] {
    return this.displayedColumns.filter(col => !col.startsWith('action'));
  }

  getProcedureEdit(procedureid: string): string {
    return `/${this.authService.getManagementOrgPath()}/procedure/${procedureid}`
  }

  onRemove(event: Event, selectedProcedure: Procedure) {
    event.stopPropagation();

    if (this.templateChild) {
      this.removeProcedure.emit(selectedProcedure);
      
      this.dataSource.data = this.dataSource.data.filter(procedure => procedure.id !== selectedProcedure.id);
      this.dataSource.filter = "";
      this.resultsLength = this.dataSource.data.length;
    }
  }

}