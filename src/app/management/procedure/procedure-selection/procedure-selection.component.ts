import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Procedure } from 'src/app/models/procedure';
import { ProcedureService } from 'src/app/services/procedure.service';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-procedure-selection',
    templateUrl: './procedure-selection.component.html',
    styleUrls: ['./procedure-selection.component.scss'],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, 
      MatAutocomplete, MatOption, MatButton, AsyncPipe
    ]
})
export class ProcedureSelectionComponent implements OnInit, OnDestroy {
  private readonly procedureService = inject(ProcedureService);

  private readonly unsubscribe = new Subject();

  @Output() selectedProcedure = new EventEmitter<Procedure>();
  procedures!: Procedure[];

  error = '';
  procedureForm = new FormControl();
  filteredOptions!: Observable<Procedure[]>;

  ngOnInit(): void {
    this.filteredOptions = this.procedureForm.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.filter(value ?? ''))
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
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
    return procedure?.name ?? '';
  }

}
