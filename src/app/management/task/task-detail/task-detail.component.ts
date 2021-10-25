import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Helper } from 'src/app/models/helper';
import { Option } from 'src/app/models/task';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnChanges {
  @Input() taskForm!: FormGroup;
  @Input() showOptions: boolean = false;
  @Input() loading: boolean = true;
  
  displayTaskTypes: any[] = TASK_TYPES;

  ngOnChanges(changes: SimpleChanges): void {
    this.onTypeChange();
  }

  private checkOptions(value: typeof TASK_TYPES) {
    this.showOptions = value[0].options;
    if (this.showOptions)
      this.taskForm.get('options')?.setValidators([Validators.required]);
    else
      this.taskForm.get('options')?.setValidators([]);

    this.taskForm.get('options')?.updateValueAndValidity();
  }

  private checkLearn(value: typeof TASK_TYPES) {
    if (value[0].learn) {
      this.taskForm.get('learn')?.enable();
    } else {
      this.taskForm.get('learn')?.disable();
      this.taskForm.get('learn')?.setValue(false);
    }
  }

  onHelperChanged(event: Helper) {
    this.taskForm.get('helper_content')?.setValue(event.content);
    this.taskForm.get('helper_renderType')?.setValue(event.renderType);
  }

  onTypeChange() {
    const value = TASK_TYPES.filter(selection =>
      this.taskForm.get('type')?.value === selection.value);

    if (value.length) {
      this.checkLearn(value);
      this.checkOptions(value);
    }
  }

}

export const toOptions = (options: string): Option[] | null => {
  if (options) {
    const opts = options.split(',');
    return options.split(',').map(opt => new Option(opt.trim()));
  }
  return null;
};

const TASK_TYPES = [
  {
    name: 'Plain text',
    value: 'TEXT',
    learn: false,
    options: false
  }, {
    name: 'Plain multiline text',
    value: 'MULTILINE_TEXT',
    learn: false,
    options: false
  }, {
    name: 'Number',
    value: 'NUMBER',
    learn: true,
    options: false
  }, {
    name: 'Checkbox',
    value: 'CHECK',
    learn: true,
    options: false
  }, {
    name: 'Radio',
    value: 'RADIO',
    learn: true,
    options: true
  }, {
    name: 'Drilldown',
    value: 'DRILLDOWN',
    learn: true,
    options: true
  }
];