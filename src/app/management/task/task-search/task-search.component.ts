import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss'],
  standalone: false
})
export class TaskSearchComponent implements OnInit {
  @Output() taskSearched = new EventEmitter<Task>();

  taskForm!: FormGroup;
  error: string = '';

  constructor(
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm?.invalid)
      return;

    this.taskSearched.emit({
      description: this.taskForm.get('description')?.value
    });
  }

  onClear() {
    this.taskForm.reset();
    this.taskForm.clearValidators();
    this.taskSearched.emit({});
  }

}
