import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap, takeUntil, map } from 'rxjs/operators';
import { Procedure } from 'src/app/models/procedure';
import { SessionService } from 'src/app/services/session.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-case-predict-next',
  templateUrl: './case-predict-next.component.html',
  styleUrls: ['./case-predict-next.component.scss'],
  standalone: false
})
export class CasePredictNextComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly sessionService = inject(SessionService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly unsubscribe = new Subject();
  @Input() procedure!: Procedure;
  @Input() caseid?: string;
  @Output() eventChange = new EventEmitter<Procedure>();

  prediction_accuracy?: number;
  prediction_id?: string;

  filteredOptions!: Observable<Procedure[]>;
  procedureForm!: FormGroup;

  ngOnInit(): void {
    this.procedureForm = this.formBuilder.group({
      next_procedure: ['', Validators.required]
    });

    this.filteredOptions = this.procedureForm.get('next_procedure')!.valueChanges
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
    return this.sessionService.listAndPredict(this.caseid!, this.procedure.id!)
      .pipe(
        takeUntil(this.unsubscribe),
        map(response => {
          if (response?.predicted) {
            this.prediction_accuracy = response.prediction_accuracy;
            this.prediction_id = response.predicted.id;

            response.data = response.data.filter(p => p.id != this.prediction_id);
            response.data.push(response.predicted);
          }

          return response.data.filter(p => p.name?.toLowerCase().includes(value));
        })
      )
  }

  private createProcedure(selectedProcedure: Procedure) {
    this.sessionService.createProcedure(this.caseid!, selectedProcedure.id!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: data => {
          if (data) {
            this.eventChange.emit(selectedProcedure);
            this.snackBar.open(`Procedure created`, 'Close', { duration: 3000 });
          }
        },
        error: error => {
          ConsoleLogger.printError('Failed to create new Procedure', error);
          this.snackBar.open(`Something went wrong`, 'Close');
        }
      });
  }

  displayFn(procedure: Procedure): string {
    return procedure?.name ?? '';
  }

  onNext() {
    if (this.procedureForm.invalid || !this.caseid)
      return;
    
    const selectedProcedure: Procedure = this.procedureForm.get('next_procedure')?.value;
    this.sessionService.resolveProcedure(this.caseid, this.procedure.id!, selectedProcedure.id!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: _data => this.createProcedure(selectedProcedure),
        error: error => {
          ConsoleLogger.printError('Failed to resolve Procedure', error);
          this.snackBar.open(`Something went wrong`, 'Close');
        }
      });
  }

  getOption(procedure: Procedure) {
    if (procedure.id === this.prediction_id)
      return `[${this.prediction_accuracy}%]: ${procedure.name} - ${procedure.description}`;
    return `${procedure.name} - ${procedure.description}`;
  }

}
