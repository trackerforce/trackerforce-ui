import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { delay, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { ProcedureListDetailsComponent } from '../procedure-list-details/procedure-list-details.component';

@Component({
    selector: 'app-procedure-list',
    templateUrl: './procedure-list.component.html',
    styleUrls: ['./procedure-list.component.scss'],
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, 
      RouterLink, MatTooltip, MatSortHeader, ProcedureListDetailsComponent, MatHeaderRowDef, MatHeaderRow, 
      MatRowDef, MatRow, MatPaginator, AsyncPipe
    ]
})
export class ProcedureListComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly procedureService = inject(ProcedureService);

  private readonly unsubscribe = new Subject();

  @Input() filter?: Subject<Procedure>
  @Input() templateChild!: boolean;
  @Input() editable = false;
  @Input() proceduresSubject!: BehaviorSubject<Procedure[] | undefined>;
  @Output() removeProcedure = new EventEmitter<Procedure>();

  displayedColumns: string[] = ['action', 'name'];
  expandedElement = signal<Procedure | null>(null);
  dataSource$!: Observable<Procedure[]>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.filter?.pipe(takeUntil(this.unsubscribe)).subscribe(procedure => this.loadData(procedure));
    this.procedureService.procedure.pipe(takeUntil(this.unsubscribe)).subscribe(procedure => this.loadData(procedure));
    
    if (this.templateChild)
      this.loadTemplateData();
  }

  ngAfterViewInit(): void {
    if (!this.templateChild) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadTemplateData() {
    this.dataSource$ = this.proceduresSubject.pipe(
      takeUntil(this.unsubscribe),
      delay(0),
      map(data => {
        this.resultsLength = data?.length ?? 0;
        this.loading = false;
        return data ?? [];
      })
    );
  }

  private loadData(procedure?: Procedure) {
    this.dataSource$ = merge(this.sort.sortChange, this.paginator.page).pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let sortBy = '';
          if (this.sort.active) {
            sortBy = `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`;
          }

          return this.procedureService.listProcedures(procedure, { 
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

  getProcedureEdit(procedureid: string): string {
    return `/${this.authService.getManagementOrgPath()}/procedure/${procedureid}`
  }

  onRemove(event: Event, selectedProcedure: Procedure) {
    event.stopPropagation();

    if (this.templateChild) {
      this.removeProcedure.emit(selectedProcedure);
      
      const current = this.proceduresSubject.value ?? [];
      this.proceduresSubject.next(current.filter(task => task.id !== selectedProcedure.id));
      this.resultsLength--;
    }
  }

  onProcedureChanged(selectedProcedure: Procedure) {
    if (this.templateChild) {
      const current = this.proceduresSubject.value ?? [];
      const updated = current.map(proc =>
        proc.id === selectedProcedure.id ? { ...proc, ...selectedProcedure } : proc
      );
      this.proceduresSubject.next(updated);
    } else {
      this.loadData();
    }
  }

  toggleExpanded(element: Procedure) {
    const currentExpanded = this.expandedElement();

    if (currentExpanded === element) {
      this.expandedElement.set(null);
    } else {
      this.expandedElement.set(element);
    }
  }

  isExpanded(element: Procedure): boolean {
    return this.expandedElement() === element;
  }

}