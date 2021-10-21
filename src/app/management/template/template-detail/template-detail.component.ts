import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Template } from 'src/app/models/template';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent implements AfterViewInit {
  @Input() template!: Template;
  @Input() templateForm!: FormGroup;
  @Input() loading: boolean = true;
  @Output() addProcedure = new EventEmitter<Procedure>();
  @Output() removeProcedure = new EventEmitter<Procedure>();

  templateProcedures = new Subject<Procedure[]>();

  ngAfterViewInit(): void {
    if (!this.loading) {
      this.templateProcedures.next(this.templateForm.get('procedures')?.value);
    }
  }

  onHelperChanged(event: Helper) {
    this.templateForm.get('helper_content')?.setValue(event.content);
    this.templateForm.get('helper_renderType')?.setValue(event.renderType);
  }

  onSelectProcedure(selectedProcedure: Procedure) {
    const procedures: Procedure[] = this.templateForm.get('procedures')?.value;
    if (!procedures.filter(procedure => procedure.id === selectedProcedure.id).length) {
      this.addProcedure.emit(selectedProcedure);
      this.templateProcedures.next(procedures);
    }
  }

  onRemoveProcedure(event: Procedure) {
    this.removeProcedure.emit(event);
  }

}