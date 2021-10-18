import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {

  taskForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm?.invalid)
      return;

    this.taskService.task.next({
      description: this.taskForm.get('description')?.value
    });
  }

  onClear() {
    this.taskForm.reset();
    this.taskForm.clearValidators();
    this.taskService.task.next({ description: '' });
  }

}
