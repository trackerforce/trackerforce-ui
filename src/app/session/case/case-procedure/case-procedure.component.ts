import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';
import { SessionService } from 'src/app/services/session.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-case-procedure',
  templateUrl: './case-procedure.component.html',
  styleUrls: ['./case-procedure.component.scss']
})
export class CaseProcedureComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  @Input() caseid?: string;
  @Input() procedure!: Procedure;
  @Output() eventChange = new EventEmitter<Procedure>();

  filteredOptions!: Observable<Procedure[]>;
  prediction_accuracy?: number;
  prediction_id?: string;
  open: boolean = true;
  procedureForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.open = this.procedure.tasks?.filter(task => task.response === undefined).length != 0;
    this.procedureForm = this.formBuilder.group({
      name: [this.procedure.name],
      description: [this.procedure.description],
      next_procedure: ['']
    });

    this.filteredOptions = this.procedureForm.get('next_procedure')!.valueChanges
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
    // return this.sessionService.listAndPredict(this.caseid!, this.procedure.id!)
    return this.sessionService.listAndPredict("615532f023fb541568a9fb64", "61552d19d535e81457b1da2b")
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

  displayFn(procedure: Procedure): string {
    return procedure && procedure.name ? procedure.name : '';
  }
  
  onTaskChange(task: Task) {
    for (let t of this.procedure.tasks!) {
      if (t.id === task.id) {
        t = task;
        break;
      }
    }
  }

  onSave() {
    if (!this.caseid)
      return;

    this.sessionService.saveProcedure(this.caseid, this.procedure)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        if (data) {
          this.eventChange.emit(this.procedure);
          this.snackBar.open(`Procedure saved`, 'Close', { duration: 3000 });
        }
      }, error => {
        ConsoleLogger.printError('Failed to save Procedure', error);
        this.snackBar.open(`Something went wrong`, 'Close');
      });
  }

  onSubmit() {
    this.eventChange.emit(this.procedure);
    this.open = false;

    this.onSave();
    this.sessionService.submitProcedure(this.caseid!, this.procedure.id!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        if (data) {
          this.eventChange.emit(this.procedure);
          this.snackBar.open(`Procedure submitted`, 'Close', { duration: 3000 });
        }
      }, error => {
        ConsoleLogger.printError('Failed to save Procedure', error);
        this.snackBar.open(`Something went wrong`, 'Close');
      });
  }

  onNext() {

  }

  onClear() {
    this.procedureForm.reset();
    this.procedureForm.clearValidators();
  }

  canSubmit() {
    return this.procedure.tasks?.filter(task => task.response === undefined).length == 0 && this.open;
  }

}
