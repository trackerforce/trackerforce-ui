import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
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
  private readonly unsubscribe: Subject<void> = new Subject();

  displayedColumns: string[] = ['action_edit', 'name', 'email'];
  expandedElement: Agent | undefined;
  data: Agent[] = [];

  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly authService: AuthService,
    private readonly agentService: AgentService
  ) { }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.agentService.agent.pipe(takeUntil(this.unsubscribe)).subscribe(agent => this.loadData(agent))

    this.loadData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadData(agent?: Agent) {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.agentService.listAgents(agent, { 
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

  getAgentEdit(agentId: string): string {
    return `/${this.authService.getManagementOrgPath()}/agent/${agentId}`
  }

}

