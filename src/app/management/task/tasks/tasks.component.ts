import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from 'src/app/models/task';
import { MatDivider } from '@angular/material/divider';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { TaskSearchComponent } from '../task-search/task-search.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    imports: [MatDivider, TaskCreateComponent, TaskSearchComponent, TaskListComponent]
})
export class TasksComponent {

  taskFilter = new Subject<Task>();

  onTaskSearched(task: Task) {
    this.taskFilter.next(task);
  }

}
