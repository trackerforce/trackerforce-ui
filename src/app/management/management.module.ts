import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedRoutingModule } from './management-routing.module';
import { HomeComponent } from './home/home.component';
import { AgentsComponent, AgentCreateComponent, AgentListComponent, AgentSearchComponent, AgentEditComponent } from './agent';
import { TasksComponent, TaskCreateComponent, TaskListComponent, TaskEditComponent } from './task';
import { ProceduresComponent, ProcedureListComponent, ProcedureListDetailsComponent } from './procedure';
import { TemplatesComponent } from './template';
import { GlobalsComponent, GlobalCreateComponent, GlobalListComponent, GlobalListDetailsComponent, GlobalSearchComponent, GlobalSelectionComponent } from './global';
import { AppMaterialModule } from '../shared/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskListDetailsComponent } from './task/task-list-details/task-list-details.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { TaskSearchComponent } from './task/task-search/task-search.component';
import { IndexHomeComponent, MyCasesComponent } from './index';
import { HelperComponent } from './helper/helper.component';
import { ProcedureSearchComponent } from './procedure/procedure-search/procedure-search.component';
import { ProcedureDetailComponent } from './procedure/procedure-detail/procedure-detail.component';
import { ProcedureCreateComponent } from './procedure/procedure-create/procedure-create.component';
import { TaskSelectionComponent } from './task/task-selection/task-selection.component';


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
    TaskSelectionComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoggedRoutingModule,
    AppMaterialModule
  ]
})
export class LoggedModule { }
