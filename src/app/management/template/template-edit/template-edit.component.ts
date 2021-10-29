import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.scss']
})
export class TemplateEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private _templateid: string = '';

  loading = true;
  error: string = '';
  template = new Template();

  constructor(
    private templateService: TemplateService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => this._templateid = params.templateid);
  }

  ngOnInit(): void {
    this.loading = true;
    this.templateService.getTemplate(this._templateid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(template => {
        if (template)
          this.template = template;
        
        this.loading = false;
      }, error => {
        ConsoleLogger.printError('Failed to load Template', error);
        this.error = error;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onTemplateChange(template: Template) {
    this.template = template;
  }

  onSubmit() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/templates`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/templates`]);
  }

}