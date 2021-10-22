import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';

@Component({
  selector: 'app-case-procedure',
  templateUrl: './case-procedure.component.html',
  styleUrls: ['./case-procedure.component.scss']
})
export class CaseProcedureComponent implements OnInit {
  @Input() procedure!: Procedure;
  @Output() eventChange = new EventEmitter<Procedure>();

  procedureForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    this.procedureForm = this.formBuilder.group({
      name: [this.procedure.name],
      description: [this.procedure.description]
    });
  }

  onSave() {
    if (this.procedureForm?.invalid)
      return;

    this.procedureService.procedure.next({
      name: this.procedureForm.get('name')?.value,
      description: this.procedureForm.get('description')?.value
    });
  }

  onSubmit() {
    this.procedureForm.reset();
    this.procedureForm.clearValidators();
    this.procedureService.procedure.next({});
  }

  onClear() {
    this.procedureForm.reset();
    this.procedureForm.clearValidators();
    this.procedureService.procedure.next({});
  }

}
