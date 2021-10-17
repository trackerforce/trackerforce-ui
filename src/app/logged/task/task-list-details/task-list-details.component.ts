import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-list-details',
  templateUrl: './task-list-details.component.html',
  styleUrls: ['./task-list-details.component.scss']
})
export class TaskListDetailsComponent implements OnInit {

  @Input() task?: Task;

  constructor() { }

  ngOnInit(): void {
  }

}
