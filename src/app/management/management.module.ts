import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './management-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent, AgentCreateComponent, AgentListComponent, AgentSearchComponent, AgentEditComponent } from './agent';
import { TasksComponent, TaskCreateComponent, TaskListComponent, TaskEditComponent, TaskListDetailsComponent, TaskSearchComponent, TaskSelectionComponent, TaskDetailComponent } from './task';
import { ProceduresComponent, ProcedureListComponent, ProcedureListDetailsComponent, ProcedureCreateComponent, ProcedureDetailComponent, ProcedureEditComponent, ProcedureSearchComponent } from './procedure';
import { TemplatesComponent } from './template';
import { GlobalsComponent, GlobalCreateComponent, GlobalListComponent, GlobalListDetailsComponent, GlobalSearchComponent, GlobalSelectionComponent } from './global';
import { AppMaterialModule } from '../shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IndexHomeComponent, MyCasesComponent } from './index';
import { HelperComponent } from './helper/helper.component';


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
    TaskSearchComponent,
    IndexHomeComponent,
    MyCasesComponent,
    GlobalListComponent,
    GlobalCreateComponent,
    GlobalSearchComponent,
    GlobalListDetailsComponent,
    GlobalSelectionComponent,
    ProcedureListComponent,
    ProcedureListDetailsComponent,
    HelperComponent,
    ProcedureSearchComponent,
    ProcedureDetailComponent,
    ProcedureCreateComponent,
    TaskSelectionComponent,
    ProcedureEditComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoggedRoutingModule,
    AppMaterialModule
  ]
})
export class LoggedModule { }
