import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  taskFilter = new Subject<Task>();

  onTaskSearched(task: Task) {
    this.taskFilter.next(task);
  }

}
