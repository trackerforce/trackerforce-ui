import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-case-task',
  templateUrl: './case-task.component.html',
  styleUrls: ['./case-task.component.scss']
})
export class CaseTaskComponent implements OnInit {
  @Input() task!: Task;
  @Output() eventChange = new EventEmitter<Task>();

  loading: boolean = true;
  taskForm!: FormGroup;
  type: string = "TEXT";
  
  constructor(
    private formBuilder: FormBuilder
  ) { 
  }

  ngOnInit(): void {
    this.type = this.task.type!;
    this.taskForm = this.formBuilder.group({
      response: ['', Validators.required]
    });

    this.loading = false;
  }

}
