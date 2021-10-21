import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-procedure-detail',
  templateUrl: './procedure-detail.component.html',
  styleUrls: ['./procedure-detail.component.scss']
})
export class ProcedureDetailComponent implements AfterViewInit {
  @Input() procedure!: Procedure;
  @Input() procedureForm!: FormGroup;
  @Input() loading: boolean = true;
  @Output() addTask = new EventEmitter<Task>();
  @Output() removeTask = new EventEmitter<Task>();

  procedureTasks = new Subject<Task[]>();

  ngAfterViewInit(): void {
    if (!this.loading) {
      this.procedureTasks.next(this.procedureForm.get('tasks')?.value);
    }
  }

  onHelperChanged(event: Helper) {
    this.procedureForm.get('helper_content')?.setValue(event.content);
    this.procedureForm.get('helper_renderType')?.setValue(event.renderType);
  }

  onSelectTask(selectedTask: Task) {
    const tasks: Task[] = this.procedureForm.get('tasks')?.value;
    if (!tasks.filter(task => task.id === selectedTask.id).length) {
      this.addTask.emit(selectedTask);
      this.procedureTasks.next(tasks);
    }
  }

  onRemoveTask(event: Task) {
    this.removeTask.emit(event);
  }

}