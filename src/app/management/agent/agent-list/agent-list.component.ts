import { AfterViewInit, Component, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { AgentService } from 'src/app/services/agent.service';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';

@Component({
    selector: 'app-agent-list',
    templateUrl: './agent-list.component.html',
    styleUrls: ['./agent-list.component.scss'],
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, 
      RouterLink, MatTooltip, MatSortHeader, MatFormField, MatLabel, MatInput, MatHeaderRowDef, 
      MatHeaderRow, MatRowDef, MatRow, MatPaginator, AsyncPipe
    ]
})
export class AgentListComponent implements AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly agentService = inject(AgentService);

  private readonly unsubscribe = new Subject();

  displayedColumns: string[] = ['action_edit'];
  expandedElement = signal<Agent | null>(null);
  data$!: Observable<Agent[]>;

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.agentService.agent.pipe(takeUntil(this.unsubscribe)).subscribe(agent => this.loadData(agent))

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  private loadData(agent?: Agent) {
    this.data$ = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let sortBy = '';
          if (this.sort.active) {
            sortBy = `${this.sort.direction === 'asc' ? '+' : '-'}${this.sort.active}`;
          }

          return this.agentService.listAgents(agent, { 
            size: this.paginator.pageSize, 
            page: this.paginator.pageIndex,
            sortBy
          }).pipe(takeUntil(this.unsubscribe));
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
    return ['name', 'email']; // Define the actual data columns here
  }

  getDisplayedColumns(): string[] {
    return [...this.displayedColumns, ...this.getColumns()];
  }

  getColumnDisplayName(column: string): string {
    const columnNames: Record<string, string> = {
      'name': 'Name',
      'email': 'Email'
    };
    return columnNames[column] || column;
  }

  getAgentEdit(agentId: string): string {
    return `/${this.authService.getManagementOrgPath()}/agent/${agentId}`
  }

  toggleExpanded(element: Agent) {
    const currentExpanded = this.expandedElement();

    if (currentExpanded === element) {
      this.expandedElement.set(null);
    } else {
      this.expandedElement.set(element);
    }
  }

  isExpanded(element: Agent): boolean {
    return this.expandedElement() === element;
  }

}

