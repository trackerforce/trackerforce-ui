import { Component, Input } from '@angular/core';
import { Task } from 'src/app/models/task';
import { DatePipe } from '@angular/common';
import { MatLabel, MatFormField, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';

@Component({
    selector: 'app-task-list-details',
    templateUrl: './task-list-details.component.html',
    styleUrls: ['./task-list-details.component.scss'],
    imports: [MatLabel, MatIcon, MatFormField, MatInput, MatSelect, MatOption, DatePipe]
})
export class TaskListDetailsComponent {
  @Input() task?: Task;
}
