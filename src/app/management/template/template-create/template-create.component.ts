import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Template } from 'src/app/models/template';
import { HelperService } from 'src/app/services/helper.service';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss'],
  standalone: false
})
export class TemplateCreateComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();

  templateSubject: Subject<Template | undefined> = new Subject();
  template!: Template;
  error: string = '';

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly templateService: TemplateService,
    private readonly helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.template = new Template();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onTemplateChange(template: Template) {
    this.template = template;
  }

  onSubmit() {
    const helper: Helper = this.template?.helper!;
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
