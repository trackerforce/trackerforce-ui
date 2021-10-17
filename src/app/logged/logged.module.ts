import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './logged-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent, AgentCreateComponent, AgentListComponent, AgentSearchComponent } from './agent';
import { TasksComponent } from './task';
import { ProceduresComponent } from './procedure';
import { TemplatesComponent } from './template';
import { GlobalsComponent } from './global';
import { AppMaterialModule } from '../shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentEditComponent } from './agent/agent-edit/agent-edit.component';
import { TaskCreateComponent } from './task/task-create/task-create.component';


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
    TaskCreateComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoggedRoutingModule,
    AppMaterialModule
  ]
})
export class LoggedModule { }
