import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcedureService } from 'src/app/services/procedure.service';

@Component({
  selector: 'app-procedure-search',
  templateUrl: './procedure-search.component.html',
  styleUrls: ['./procedure-search.component.scss']
})
export class ProcedureSearchComponent implements OnInit {

  procedureForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    this.procedureForm = this.formBuilder.group({
      name: [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.procedureForm?.invalid)
      return;

    this.procedureService.procedure.next({
      name: this.procedureForm.get('name')?.value,
      description: this.procedureForm.get('description')?.value
    });
  }

  onClear() {
    this.procedureForm.reset();
    this.procedureForm.clearValidators();
    this.procedureService.procedure.next({});
  }

}
