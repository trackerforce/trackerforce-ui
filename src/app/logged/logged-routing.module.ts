import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AgentsComponent } from './agents/agents.component';
import { GlobalsComponent } from './globals/globals.component';
import { HomeComponent } from './home/home.component';
import { ProceduresComponent } from './procedures/procedures.component';
import { TasksComponent } from './tasks/tasks.component';
import { TemplatesComponent } from './templates/templates.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], 
    children: [
      { path: 'agents', component: AgentsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'procedures', component: ProceduresComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'globals', component: GlobalsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedRoutingModule { }
