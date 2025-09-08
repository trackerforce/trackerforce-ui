import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { TemplateDetailComponent } from '../template-detail/template-detail.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-template-edit',
    templateUrl: './template-edit.component.html',
    styleUrls: ['./template-edit.component.scss'],
    imports: [MatProgressSpinner, MatDivider, MatCard, MatCardHeader, MatCardTitle, 
      MatCardContent, TemplateDetailComponent, MatButton, AsyncPipe
    ]
})
export class TemplateEditComponent implements OnInit, OnDestroy {
  private readonly templateService = inject(TemplateService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly unsubscribe = new Subject();
  private _templateid = '';

  loading = true;
  error = '';
  template$ = new BehaviorSubject<Template | null>(null);

  constructor() {
    this.route.params.subscribe(params => this._templateid = params.templateid);
  }

  ngOnInit(): void {
    this.loading = true;
    this.templateService.getTemplate(this._templateid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: template => {
          this.template$.next(template);
          this.loading = false;
        },
        error: error => {
          ConsoleLogger.printError('Failed to load Template', error);
          this.error = error.error;
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onTemplateChange(template: Template) {
    this.template$.next(template);
  }

  onSubmit() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/templates`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/templates`]);
  }

}