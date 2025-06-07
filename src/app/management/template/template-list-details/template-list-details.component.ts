import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-template-list-details',
  templateUrl: './template-list-details.component.html',
  styleUrls: ['./template-list-details.component.scss'],
  standalone: false
})
export class TemplateListDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly templateService = inject(TemplateService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly unsubscribe = new Subject();

  @Input() template?: Template
  @Output() templateChanged = new EventEmitter<Template>();

  proceduresSubject = new BehaviorSubject<Procedure[] | undefined>(undefined);
  templateForm!: FormGroup;
  error = '';

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      name: [this.template?.name, Validators.required],
      description: [this.template?.description, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.proceduresSubject.next(this.template?.procedures);
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.templateForm?.invalid)
      return;

    const updatedTemplate: Template = {
      id: this.template?.id,
      name: this.templateForm.get('name')?.value,
      description: this.templateForm.get('description')?.value,
    }

    const helper: Helper = {
      content: this.templateForm.get('helper_content')?.value,
      renderType: this.templateForm.get('helper_renderType')?.value
    }

    this.templateService.updateTemplate(updatedTemplate, helper)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: template => {
          if (template) {
            this.template = template;
            this.templateChanged.emit(template);
            this.snackBar.open(`Template updated`, 'Close', { duration: 2000 });
          }
        },
        error: error => {
          ConsoleLogger.printError('Failed to update Template', error);
          this.error = error.error;
        }
      });

  }

}
