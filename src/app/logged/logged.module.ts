import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './logged-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent } from './agents/agents.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { TemplatesComponent } from './templates/templates.component';
import { GlobalsComponent } from './globals/globals.component';
import { AppMaterialModule } from '../shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentCreateComponent } from './agent-create/agent-create.component';
import { AgentSearchComponent } from './agent-search/agent-search.component';
import { AgentListComponent } from './agent-list/agent-list.component';


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
    AgentListComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoggedRoutingModule,
    AppMaterialModule
  ]
})
export class LoggedModule { }
