import { AfterViewInit, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { AgentService } from 'src/app/services/agent.service';
import { detailsAnimation } from 'src/app/_helpers/animations';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss'],
  animations: [detailsAnimation],
  standalone: false
})
export class AgentListComponent implements AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly agentService = inject(AgentService);

  private readonly unsubscribe = new Subject();

  displayedColumns: string[] = ['action_edit', 'name', 'email'];
  expandedElement: Agent | undefined;
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
    return this.displayedColumns.filter(col => !col.startsWith('action'));
  }

  getAgentEdit(agentId: string): string {
    return `/${this.authService.getManagementOrgPath()}/agent/${agentId}`
  }

}

