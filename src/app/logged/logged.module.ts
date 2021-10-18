import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './logged-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent, AgentCreateComponent, AgentListComponent, AgentSearchComponent, AgentEditComponent } from './agent';
import { TasksComponent, TaskCreateComponent, TaskListComponent, TaskEditComponent } from './task';
import { ProceduresComponent } from './procedure';
import { TemplatesComponent } from './template';
import { GlobalsComponent } from './global';
import { AppMaterialModule } from '../shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskListDetailsComponent } from './task/task-list-details/task-list-details.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { TaskSearchComponent } from './task/task-search/task-search.component';


@NgModule({
  declarations: [
    HomeComponent,
    AgentsComponent,
    TasksComponent,
    ProceduresComponent,
    TemplatesComponent,
    GlobalsComponent,
    AgentCreateComponent,
    AgentSearchComponent,
    AgentListComponent,
    AgentEditComponent,
    TaskCreateComponent,
    TaskListComponent,
    TaskEditComponent,
    TaskListDetailsComponent,
    TaskDetailComponent,
    TaskSearchComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoggedRoutingModule,
    AppMaterialModule
  ]
})
export class LoggedModule { }
