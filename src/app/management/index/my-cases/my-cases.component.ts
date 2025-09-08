import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { Case } from 'src/app/models/case';
import { AgentService } from 'src/app/services/agent.service';
import { SessionService } from 'src/app/services/session.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { MatCard, MatCardTitleGroup, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatLabel, MatFormField, MatInput } from '@angular/material/input';

@Component({
    selector: 'app-my-cases',
    templateUrl: './my-cases.component.html',
    styleUrls: ['./my-cases.component.scss'],
    imports: [MatCard, MatCardTitleGroup, MatCardTitle, MatIcon, MatCardContent, MatTable, MatSort, MatColumnDef, 
      MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, RouterLink, MatTooltip, MatLabel, MatFormField, MatInput, 
      MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, AsyncPipe, DatePipe
    ]
})
export class MyCasesComponent implements AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly agentService = inject(AgentService);
  private readonly sessionService = inject(SessionService);
  private readonly cdk = inject(ChangeDetectorRef);

  private readonly unsubscribe = new Subject();

  displayedColumns: string[] = ['custom_view', 'context', 'custom_status'];
  expandedElement = signal<Case | null>(null);
  dataSource$!: Observable<Case[]>

  resultsLength = 0;

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

  private loadData(_?: Agent) {
    const sessionid = this.authService.getUserInfo('sessionid');
    this.dataSource$ = merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        return this.sessionService.listAgentCases(sessionid, { 
          size: this.paginator.pageSize, 
          page: this.paginator.pageIndex 
        }).pipe(takeUntil(this.unsubscribe))
      }),
      map(data => {
        if (data === null) return [];
        this.resultsLength = data.items;
        return data.data;
      })
    );
  }

  getColumns(): string[] {
    return this.displayedColumns.filter(col => !col.startsWith('custom'));
  }

  getStatus(element: Case) {
    return element.procedures
      ?.filter(p => p.status != 'RESOLVED')
      .length ? 'In Progress' : 'Closed';
  }

  getCaseLink(sessionCase: Case): string {
    return `/${this.authService.getSessionOrgPath()}/case/${sessionCase.protocol}`
  }

  onStopWatching(sessionCase: Case) {
    const sessionid = this.authService.getUserInfo('sessionid');
    this.agentService.unWatchCase(sessionid, sessionCase.id!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.loadData();
          this.cdk.detectChanges();
        },
        error: error => {
          ConsoleLogger.printError('Failed to unWatch', error);
        }
      });
  }

  toggleExpanded(element: Case) {
    const currentExpanded = this.expandedElement();

    if (currentExpanded === element) {
      this.expandedElement.set(null);
    } else {
      this.expandedElement.set(element);
    }
  }

  isExpanded(element: Case): boolean {
    return this.expandedElement() === element;
  }

}

