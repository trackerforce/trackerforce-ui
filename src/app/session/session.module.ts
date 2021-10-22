import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../shared/app-material.module';
import { HomeComponent } from './home/home.component';
import { SessionRoutingModule } from './session-routing.module';
import { CaseProcedureComponent, CaseListComponent } from './case';


@NgModule({
  declarations: [
    HomeComponent,
    CaseProcedureComponent,
    CaseListComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SessionRoutingModule,
    AppMaterialModule
  ]
})
export class SessionModule { }
