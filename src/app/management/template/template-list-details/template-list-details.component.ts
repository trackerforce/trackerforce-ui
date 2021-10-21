import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-template-list-details',
  templateUrl: './template-list-details.component.html',
  styleUrls: ['./template-list-details.component.scss']
})
export class TemplateListDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Input() template?: Template
  templateForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private templateService: TemplateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      name: [this.template?.name, Validators.required],
      description: [this.template?.description, Validators.required]
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.templateForm?.invalid)
      return;

    const template: Template = {
      id: this.template?.id,
      name: this.templateForm.get('name')?.value,
      description: this.templateForm.get('description')?.value,
    }

    const helper: Helper = {
      content: this.templateForm.get('helper_content')?.value,
      renderType: this.templateForm.get('helper_renderType')?.value
    }

    this.templateService.updateTemplate(template, helper)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(template => {
        if (template) {
          this.template = template;
          this.snackBar.open(`Template updated`, 'Close', { duration: 2000 });
        }
      }, error => {
        ConsoleLogger.printError('Failed to update Template', error);
        this.error = error;
      });

  }

}
