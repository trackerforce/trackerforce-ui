import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Procedure } from 'src/app/models/procedure';
import { MatDivider } from '@angular/material/divider';
import { ProcedureCreateComponent } from '../procedure-create/procedure-create.component';
import { ProcedureSearchComponent } from '../procedure-search/procedure-search.component';
import { ProcedureListComponent } from '../procedure-list/procedure-list.component';

@Component({
    selector: 'app-procedures',
    templateUrl: './procedures.component.html',
    styleUrls: ['./procedures.component.scss'],
    imports: [MatDivider, ProcedureCreateComponent, ProcedureSearchComponent, ProcedureListComponent]
})
export class ProceduresComponent {

  procedureFilter = new Subject<Procedure>();

  onProcedureSearched(procedure: Procedure) {
    this.procedureFilter.next(procedure);
  }
}
