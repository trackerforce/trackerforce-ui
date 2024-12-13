import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Procedure } from 'src/app/models/procedure';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss'],
  standalone: false
})
export class ProceduresComponent {

  procedureFilter = new Subject<Procedure>();

  onProcedureSearched(procedure: Procedure) {
    this.procedureFilter.next(procedure);
  }
}
