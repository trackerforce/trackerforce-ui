import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './logged-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent } from './agents/agents.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { TemplatesComponent } from './templates/templates.component';
import { GlobalsComponent } from './globals/globals.component';


@NgModule({
  declarations: [
    HomeComponent,
    AgentsComponent,
    TasksComponent,
    ProceduresComponent,
    TemplatesComponent,
    GlobalsComponent
  ],
  imports: [
    CommonModule,
    LoggedRoutingModule
  ]
})
export class LoggedModule { }
