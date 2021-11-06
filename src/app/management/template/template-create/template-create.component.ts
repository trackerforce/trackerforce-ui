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
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  templateSubject: Subject<Template> = new Subject();
  template!: Template;
  error: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private templateService: TemplateService,
    private helperService: HelperService
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
    const template: Template = {
      name: this.template.name,
      description: this.template.description,
      procedures: this.template.procedures
    }

    this.templateService.createTemplate(template, helper).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.snackBar.open(`Template created`, 'Close', { duration: 2000 });
        this.templateSubject.next(undefined);
        this.onCancel();
      }
    }, error => {
      ConsoleLogger.printError('Failed to create Template', error);
      this.error = error.error;
    });
  }

  onCancel() {
    this.helperService.helper.next(undefined);
    this.templateService.template.next(new Template());
  }
  
}
