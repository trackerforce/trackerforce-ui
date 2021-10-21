import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
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
  templateForm!: FormGroup;
  error: string = '';
  template?: Template = undefined;

  constructor(
    private formBuilder: FormBuilder,
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
        if (template) {
          this.template = template;
          this.templateForm = this.formBuilder.group({
            name: [this.template.name, Validators.required],
            description: [this.template.description, Validators.required],
            procedures: [this.template.procedures],
            helper_content: [this.template.helper?.content],
            helper_renderType: [this.template.helper?.renderType]
          });
        }
      }, error => {
        ConsoleLogger.printError('Failed to load Template', error);
        this.error = error;
      }, () => {
        this.loading = false;
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
    if (this.templateForm?.invalid)
      return;

    return this.router.navigate([`${this.authService.getManagementOrgPath()}/templates`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/templates`]);
  }

}