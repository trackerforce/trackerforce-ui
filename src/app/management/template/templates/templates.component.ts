import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Template } from 'src/app/models/template';
import { MatDivider } from '@angular/material/divider';
import { TemplateCreateComponent } from '../template-create/template-create.component';
import { TemplateSearchComponent } from '../template-search/template-search.component';
import { TemplateListComponent } from '../template-list/template-list.component';

@Component({
    selector: 'app-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss'],
    imports: [MatDivider, TemplateCreateComponent, TemplateSearchComponent, TemplateListComponent]
})
export class TemplatesComponent {

  templateFilter = new Subject<Template>();

  onTemplateSearched(template: Template) {
    this.templateFilter.next(template);
  }

}
