import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/models/helper';
import { HelperService } from 'src/app/services/helper.service';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatFormField, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';

@Component({
    selector: 'app-helper',
    templateUrl: './helper.component.html',
    styleUrls: ['./helper.component.scss'],
    imports: [ReactiveFormsModule, MatDivider, MatIcon, MatLabel, MatFormField, MatInput, MatSelect, MatOption]
})
export class HelperComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly helperService = inject(HelperService);

  @Input() helper!: Helper | undefined;
  @Output() selectedHelper = new EventEmitter<Helper>();

  formGroup!: FormGroup;
  displayRenderTypes: string[] = ['PLAINTEXT', 'MARKDOWN', 'HTML'];

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
