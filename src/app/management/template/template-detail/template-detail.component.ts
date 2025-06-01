import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss'],
  standalone: false
})
export class TemplateDetailComponent implements OnInit, AfterViewInit {
  @Input() template!: Template;
  @Output() templateChanged = new EventEmitter<Template>();

  proceduresSubject = new BehaviorSubject<Procedure[] | undefined>(undefined);
  templateForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly templateService: TemplateService
  ) { }

  ngOnInit(): void {
    this.templateService.template.subscribe(template => {
      this.template = template;
      this.templateForm.reset();
      this.proceduresSubject.next(this.template.procedures);
    });

    this.templateForm = this.formBuilder.group({
      name: [this.template.name, Validators.required],
      description: [this.template.description, Validators.required]
    });

    this.templateForm.valueChanges.subscribe(template => {
      this.template.name = template.name;
      this.template.description = template.description;
      this.templateChanged.emit(this.template);
    });
  }

  ngAfterViewInit(): void {
    this.proceduresSubject.next(this.template.procedures);
  }

  onHelperChanged(helper: Helper) {
    this.template.helper = helper;
    this.templateChanged.emit(this.template);
  }

  onSelectProcedure(selectedProcedure: Procedure) {
    this.template.procedures ??= [];

    if (!this.template.procedures.filter(procedure => procedure.id === selectedProcedure.id).length || 
      this.template.procedures.length === 0) {
      this.template.procedures = [...this.template.procedures, selectedProcedure];
      this.proceduresSubject.next(this.template.procedures);
      this.templateChanged.emit(this.template);
    }
  }

  onRemoveProcedure(procedure: Procedure) {
    this.template.procedures = this.template?.procedures!.filter(p => p.id !== procedure.id);
    this.templateChanged.emit(this.template);
  }

  hasProcedures(): boolean {
    return this.template.procedures! && this.template.procedures.length > 0;
  }

}