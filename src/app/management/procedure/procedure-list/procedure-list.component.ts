import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { delay, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { detailsAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss'],
  animations: [detailsAnimation],
  standalone: false
})
export class ProcedureListComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();

  @Input() filter?: Subject<Procedure>
  @Input() templateChild!: boolean;
  @Input() editable: boolean = false;
  @Input() proceduresSubject!: BehaviorSubject<Procedure[] | undefined>;
  @Output() removeProcedure = new EventEmitter<Procedure>();

  displayedColumns: string[] = ['action', 'name'];
  expandedElement: Procedure | undefined;
  dataSource$!: Observable<Procedure[]>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly authService: AuthService,
    private readonly procedureService: ProcedureService
  ) { }

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
    this.unsubscribe.next();
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

}