import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AgentsComponent, AgentEditComponent } from './agent';
import { GlobalsComponent } from './global';
import { HomeComponent } from './home/home.component';
import { ProceduresComponent } from './procedure';
import { TasksComponent, TaskEditComponent } from './task';
import { TemplatesComponent } from './template';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], 
    children: [
      { path: 'agents', component: AgentsComponent, data: { view: 'agents' } },
      { path: 'agent/:agentid', component: AgentEditComponent, data: { view: 'agents' } },
      { path: 'tasks', component: TasksComponent, data: { view: 'tasks' } },
      { path: 'task/:taskid', component: TaskEditComponent, data: { view: 'tasks' } },
      { path: 'procedures', component: ProceduresComponent, data: { view: 'procedures' } },
      { path: 'templates', component: TemplatesComponent, data: { view: 'templates' } },
      { path: 'globals', component: GlobalsComponent, data: { view: 'globals' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedRoutingModule { }
