import { Component, Input } from '@angular/core';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-list-details',
  templateUrl: './task-list-details.component.html',
  styleUrls: ['./task-list-details.component.scss'],
  standalone: false
})
export class TaskListDetailsComponent {
  @Input() task?: Task;
}
