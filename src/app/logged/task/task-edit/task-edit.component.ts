import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  displayRenderTypes: string[] = ['PLAINTEXT'];
  displayTaskTypes: any[] = taskTypes;

  learnDisabled: boolean = false;
  taskCreateExpanded: boolean = false;
  taskForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      description: ['', Validators.required],
      type: ['', Validators.required],
      learn: [''],
      hidden: [''],
      helper_content: [''],
      helper_rendertype: ['']
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.taskForm?.invalid)
      return;
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
