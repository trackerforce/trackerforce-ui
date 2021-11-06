import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Procedure } from 'src/app/models/procedure';

@Component({
  selector: 'app-procedure-search',
  templateUrl: './procedure-search.component.html',
  styleUrls: ['./procedure-search.component.scss']
})
export class ProcedureSearchComponent implements OnInit {
  @Output() procedureSearched = new EventEmitter<Procedure>();

  procedureForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder
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

    this.procedureSearched.emit({
      name: this.procedureForm.get('name')?.value,
      description: this.procedureForm.get('description')?.value
    });
  }

  onClear() {
    this.procedureForm.reset();
    this.procedureForm.clearValidators();
    this.procedureSearched.emit({});
  }

}
