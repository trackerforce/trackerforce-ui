import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  templateForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private templateService: TemplateService
  ) { }

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      procedures: [[]],
      helper_content: [''],
      helper_renderType: ['']
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onAddProcedure(procedure: Procedure) {
    const procedures: Procedure[] = this.templateForm.get('procedures')?.value
    procedures.push(procedure);
    this.templateForm.get('procedures')?.setValue(procedures);
  }

  onRemoveProcedure(procedure: Procedure) {
    let procedures: Procedure[] = this.templateForm.get('procedures')?.value
    procedures = procedures.filter(p => p.id !== procedure.id);
    this.templateForm.get('procedures')?.setValue(procedures);
  }

  onSubmit() {
    if (this.templateForm?.invalid) {
      this.error = 'Template has missing parameters'
      return;
    }

    const template: Template = {
      name: this.templateForm.get('name')?.value,
      description: this.templateForm.get('description')?.value,
      procedures: this.templateForm.get('procedures')?.value
    }

    const helper: Helper = {
      content: this.templateForm.get('helper_content')?.value,
      renderType: this.templateForm.get('helper_renderType')?.value
    }

    this.templateService.createTemplate(template, helper).pipe(takeUntil(this.unsubscribe)).subscribe(task => {
      if (task) {
        this.snackBar.open(`Template created`, 'Close', { duration: 2000 });
        this.templateService.template.next(undefined);
        this.templateForm.reset();
      }
    }, error => {
      ConsoleLogger.printError('Failed to create Template', error);
      this.error = error;
    });
  }
  
}
