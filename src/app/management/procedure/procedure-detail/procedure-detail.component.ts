import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Helper } from 'src/app/models/helper';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-procedure-detail',
  templateUrl: './procedure-detail.component.html',
  styleUrls: ['./procedure-detail.component.scss']
})
export class ProcedureDetailComponent {
  @Input() procedureForm!: FormGroup;
  @Input() loading: boolean = true;
  @Output() addTask = new EventEmitter<Task>();

  procedureTasks = new Subject<Task[]>();

  selectTask(selectedTask: Task) {
    const tasks: Task[] = this.procedureForm.get('tasks')?.value

    if (!tasks.filter(task => task.id === selectedTask.id).length) {
      this.addTask.emit(selectedTask);
      this.procedureTasks.next(tasks);
    }
  }

  onHelperChanged(event: Helper) {
    this.procedureForm.get('helper_content')?.setValue(event.content);
    this.procedureForm.get('helper_renderType')?.setValue(event.renderType);
  }
}