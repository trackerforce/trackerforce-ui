import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';
import { ProcedureService } from 'src/app/services/procedure.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-procedure-selection',
  templateUrl: './procedure-selection.component.html',
  styleUrls: ['./procedure-selection.component.scss']
})
export class ProcedureSelectionComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Output() selectedProcedure = new EventEmitter<Procedure>();
  procedures!: Procedure[];

  error: string = '';
  procedureForm = new FormControl();
  filteredOptions!: Observable<Procedure[]>;

  constructor(
    private procedureService: ProcedureService,
  ) { }

  ngOnInit(): void {
    this.filteredOptions = this.procedureForm.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.filter(value || ''))
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private filter(value: string): Observable<Procedure[]> {
    return this.procedureService.listProcedures({ name: value })
      .pipe(
        takeUntil(this.unsubscribe),
        map(response => response.data)
      )
  }

  onSubmit() {
    if (this.procedureForm.value) {
      this.selectedProcedure.emit(this.procedureForm.value);
      this.procedureForm.reset();
    }
  }

  displayFn(procedure: Procedure): string {
    return procedure && procedure.name ? procedure.name : '';
  }

}
