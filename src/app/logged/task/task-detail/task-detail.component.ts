import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  @Input() taskForm!: FormGroup;

  displayRenderTypes: string[] = ['PLAINTEXT', 'MARKDOWN', 'HTML'];
  displayTaskTypes: any[] = taskTypes;
  learnDisabled: boolean = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  onTypeChange() {
    if (this.taskForm.get('type')?.value.learn)
      this.taskForm.get('learn')?.enable();
    else {
      this.taskForm.get('learn')?.disable();
      this.taskForm.get('learn')?.setValue(false);
    }
  }

}

const taskTypes = [
  {
    name: 'Plain text',
    value: 'TEXT',
    learn: false
  }, {
    name: 'Plain multiline text',
    value: 'MULTILINE_TEXT',
    learn: false
  }, {
    name: 'Number',
    value: 'NUMBER',
    learn: true
  }, {
    name: 'Checkbox',
    value: 'CHECK',
    learn: true
  }, {
    name: 'Radio',
    value: 'RADIO',
    learn: true
  }, {
    name: 'Drilldown',
    value: 'DRILLDOWN',
    learn: true
  }
]