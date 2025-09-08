import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Procedure } from 'src/app/models/procedure';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-procedure-search',
    templateUrl: './procedure-search.component.html',
    styleUrls: ['./procedure-search.component.scss'],
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, 
      MatExpansionPanelDescription, ReactiveFormsModule, MatFormField, MatInput, MatButton
    ]
})
export class ProcedureSearchComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  @Output() procedureSearched = new EventEmitter<Procedure>();

  procedureForm!: FormGroup;
  error = '';

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
