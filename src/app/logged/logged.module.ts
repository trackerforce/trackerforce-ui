import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './logged-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent, AgentCreateComponent, AgentListComponent, AgentSearchComponent } from './agent';
import { TasksComponent } from './tasks/tasks.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { TemplatesComponent } from './templates/templates.component';
import { GlobalsComponent } from './globals/globals.component';
import { AppMaterialModule } from '../shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentEditComponent } from './agent/agent-edit/agent-edit.component';


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
    AgentEditComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoggedRoutingModule,
    AppMaterialModule
  ]
})
export class LoggedModule { }
