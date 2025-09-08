import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Template } from 'src/app/models/template';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-template-search',
    templateUrl: './template-search.component.html',
    styleUrls: ['./template-search.component.scss'],
    imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, 
      MatExpansionPanelDescription, ReactiveFormsModule, MatFormField, MatInput, MatButton
    ]
})
export class TemplateSearchComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  @Output() templateSearched = new EventEmitter<Template>();

  templateForm!: FormGroup;
  error = '';

  ngOnInit(): void {
    this.templateForm = this.formBuilder.group({
      name: [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.templateForm?.invalid)
      return;

    this.templateSearched.emit({
      name: this.templateForm.get('name')?.value,
      description: this.templateForm.get('description')?.value
    });
  }

  onClear() {
    this.templateForm.reset();
    this.templateForm.clearValidators();
    this.templateSearched.emit({});
  }

}
