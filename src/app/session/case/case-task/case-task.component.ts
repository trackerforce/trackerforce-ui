import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-case-task',
  templateUrl: './case-task.component.html',
  styleUrls: ['./case-task.component.scss']
})
export class CaseTaskComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Input() task!: Task;
  @Input() open: boolean = true;
  @Output() eventChange = new EventEmitter<Task>();

  taskForm!: FormGroup;
  type: string = "TEXT";
  
  constructor(
    private formBuilder: FormBuilder
  ) { 
  }

  ngOnInit(): void {
    this.type = this.task.type!;
    this.taskForm = this.formBuilder.group({
      response: [this.task.response, Validators.required]
    });

    this.taskForm.valueChanges.pipe(takeUntil(this.unsubscribe), debounceTime(500))
      .subscribe(data => {
        this.task.response = data.response;
        this.eventChange.emit(this.task);
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
