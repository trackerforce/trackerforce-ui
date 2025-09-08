import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Template } from 'src/app/models/template';
import { HelperService } from 'src/app/services/helper.service';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TemplateDetailComponent } from '../template-detail/template-detail.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-template-create',
    templateUrl: './template-create.component.html',
    styleUrls: ['./template-create.component.scss'],
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, 
      MatExpansionPanelDescription, TemplateDetailComponent, MatButton
    ]
})
export class TemplateCreateComponent implements OnInit, OnDestroy {
  private readonly snackBar = inject(MatSnackBar);
  private readonly templateService = inject(TemplateService);
  private readonly helperService = inject(HelperService);

  private readonly unsubscribe = new Subject();

  templateSubject = new Subject();
  template!: Template;
  error = '';

  ngOnInit(): void {
    this.template = new Template();
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onTemplateChange(template: Template) {
    this.template = template;
  }

  onSubmit() {
    const helper: Helper = this.template.helper!;
    const newTemplate: Template = {
      name: this.template.name,
      description: this.template.description,
      procedures: this.template.procedures
    }

    this.templateService.createTemplate(newTemplate, helper)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe({
      next: template => {
        if (template) {
          this.snackBar.open(`Template created`, 'Close', { duration: 2000 });
          this.templateSubject.next(undefined);
          this.onCancel();
        }
      },
      error: error => {
        ConsoleLogger.printError('Failed to create Template', error);
        this.error = error.error;
      }
    });
  }

  onCancel() {
    this.helperService.helper.next(undefined);
    this.templateService.template.next(new Template());
  }
  
}
