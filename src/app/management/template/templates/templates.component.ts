import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Template } from 'src/app/models/template';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  standalone: false
})
export class TemplatesComponent {

  templateFilter = new Subject<Template>();

  onTemplateSearched(template: Template) {
    this.templateFilter.next(template);
  }

}
