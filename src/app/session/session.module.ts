import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../shared/app-material.module';
import { HomeComponent } from './home/home.component';
import { SessionRoutingModule } from './session-routing.module';
import { CaseProcedureComponent } from './case';
import { IndexHomeComponent } from './case/home/home.component';
import { CaseTaskComponent } from './case/case-task/case-task.component';


@NgModule({
  declarations: [
    HomeComponent,
    IndexHomeComponent,
    CaseProcedureComponent,
    CaseTaskComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SessionRoutingModule,
    AppMaterialModule
  ]
})
export class SessionModule { }
