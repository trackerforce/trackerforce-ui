import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Helper } from 'src/app/models/helper';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent implements AfterViewInit {
  @Input() form!: FormGroup;
  @Output() selectedHelper = new EventEmitter<Helper>();

  displayRenderTypes: string[] = ['PLAINTEXT', 'MARKDOWN', 'HTML'];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    this.form = this.formBuilder.group({
      helper_content: [this.form.get('helper_content')?.value],
      helper_renderType: [this.form.get('helper_renderType')?.value]
    });

    this.form.valueChanges.subscribe(helper => {
      this.selectedHelper.emit({
        content: helper.helper_content,
        renderType: helper.helper_renderType
      });
    });
  }

}
