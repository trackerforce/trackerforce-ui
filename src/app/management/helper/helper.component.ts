import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Helper } from 'src/app/models/helper';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
  standalone: false
})
export class HelperComponent implements OnInit {
  @Input() helper!: Helper | undefined;
  @Output() selectedHelper = new EventEmitter<Helper>();

  formGroup!: FormGroup;
  displayRenderTypes: string[] = ['PLAINTEXT', 'MARKDOWN', 'HTML'];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      content: [this.helper?.content],
      renderType: [this.helper?.renderType]
    });

    this.helperService.helper.subscribe(helper => {
      this.helper = helper;
      this.formGroup.patchValue({
        content: this.helper?.content ?? '',
        renderType: this.helper?.renderType ?? 'PLAINTEXT'
      });
    });
    
    this.formGroup.valueChanges.subscribe(helper => 
      this.selectedHelper.emit(helper));
  }

}
