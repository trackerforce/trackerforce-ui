import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Template } from 'src/app/models/template';

@Component({
  selector: 'app-template-search',
  templateUrl: './template-search.component.html',
  styleUrls: ['./template-search.component.scss']
})
export class TemplateSearchComponent implements OnInit {
  @Output() templateSearched = new EventEmitter<Template>();

  templateForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder
  ) { }

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
