import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Helper } from 'src/app/models/helper';
import { Option, Task, TASK_TYPES } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  @Input() task!: Task;
  @Input() showOptions: boolean = false;
  @Output() taskChanged = new EventEmitter<Task>();
  
  taskForm!: FormGroup;
  displayTaskTypes: any[] = TASK_TYPES;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskService.task.subscribe(task => {
      this.task = task;
      this.taskForm.reset();
    });

    this.taskForm = this.formBuilder.group({
      description: [this.task.description, Validators.required],
      type: [this.task.type, Validators.required],
      options: [this.task.options?.map(opt => opt.value)],
      learn: [this.task.learn],
      hidden: [this.task.hidden]
    });

    this.taskForm.valueChanges.subscribe(task => {
      this.task.description = task.description;
      this.task.type = task.type;
      this.task.options = this.toOptions(task.options);
      this.task.learn = task.learn;
      this.task.hidden = task.hidden;
      this.taskChanged.emit(this.task);
    });
  }

  private checkOptions(value: typeof TASK_TYPES) {
    const formOptions = this.taskForm.get('options');
    this.showOptions = value[0].options;

    if (this.showOptions)
      formOptions?.setValidators([Validators.required]);
    else
      formOptions?.setValidators([]);

    formOptions?.updateValueAndValidity();
  }

  private checkLearn(value: typeof TASK_TYPES) {
    const formLearn = this.taskForm.get('learn');

    if (value[0].learn) {
      formLearn?.enable();
    } else {
      formLearn?.disable();
      formLearn?.setValue(false);
    }
  }

  private toOptions(options: string): Option[] {
    if (options) {
      const opts = options.split(',');
      return options.split(',').map(opt => new Option(opt.trim()));
    }
    
    return [];
  };

  onHelperChanged(helper: Helper) {
    this.task.helper = helper;
    this.taskChanged.emit(this.task);
  }

  onTypeChange() {
    const value = TASK_TYPES.filter(selection =>
      this.task.type === selection.value);

    if (value.length) {
      this.checkLearn(value);
      this.checkOptions(value);
    }
  }

}