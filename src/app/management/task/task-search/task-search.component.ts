import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss'],
  standalone: false
})
export class TaskSearchComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  @Output() taskSearched = new EventEmitter<Task>();

  taskForm!: FormGroup;
  error = '';

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
