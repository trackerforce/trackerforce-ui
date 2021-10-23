import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  procedureForm!: FormGroup;
  error: string = '';
  loading: boolean = false;

  open: boolean = true;
  submitted: boolean = false;
  resolved: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.readProcedureStatuses();
    this.procedureForm = this.formBuilder.group({
      name: [this.procedure.name],
      description: [this.procedure.description]
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private readProcedureStatuses() {
    this.open = this.procedure.status === 'OPENED';
    this.submitted = this.procedure.status === 'SUBMITTED';
    this.resolved = this.procedure.status === 'RESOLVED';
  }

  private save(caseid: string) {
    return this.sessionService.saveProcedure(caseid, this.procedure)
      .pipe(takeUntil(this.unsubscribe));
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

    this.loading = true;
    this.save(this.caseid).subscribe(data => {
      this.loading = false;
      if (data) {
        this.eventChange.emit(this.procedure);
        this.snackBar.open(`Procedure saved`, 'Close', { duration: 3000 });
      }
    }, error => {
      ConsoleLogger.printError('Failed to save Procedure', error);
      this.snackBar.open(`Something went wrong`, 'Close');
      this.loading = false;
    });
  }

  onSubmit() {
    if (!this.caseid)
      return;

    this.loading = true;
    this.save(this.caseid).subscribe(data => {
      if (data) {
        this.sessionService.submitProcedure(this.caseid!, this.procedure.id!)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(data => {
            if (data) {
              this.procedure = data;
              this.readProcedureStatuses();
              this.snackBar.open(`Procedure submitted`, 'Close', { duration: 3000 });
              this.loading = false;
              this.eventChange.emit(this.procedure);
            }
          }, error => {
            ConsoleLogger.printError('Failed to save Procedure', error);
            this.snackBar.open(`Something went wrong`, 'Close');
            this.loading = false;
          });
      }
    });
  }

  onResolved(procedure: Procedure) {
    this.resolved = true;
    this.eventChange.emit(procedure);
  }

  canSubmit() {
    return this.open && 
      this.procedure.tasks?.filter(task => task.response === undefined).length == 0;;
  }

  hasTasks() {
    return this.procedure.tasks != undefined && this.procedure.tasks?.length > 0;
  }

}
