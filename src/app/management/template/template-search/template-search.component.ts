import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-template-search',
  templateUrl: './template-search.component.html',
  styleUrls: ['./template-search.component.scss']
})
export class TemplateSearchComponent implements OnInit {

  templateForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private templateService: TemplateService
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

    this.templateService.template.next({
      name: this.templateForm.get('name')?.value,
      description: this.templateForm.get('description')?.value
    });
  }

  onClear() {
    this.templateForm.reset();
    this.templateForm.clearValidators();
    this.templateService.template.next({});
  }

}
