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
    this.submitted = true;
    // this.sessionService.submitProcedure(this.caseid!, this.procedure.id!)
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(data => {
    //     if (data) {
    //       this.eventChange.emit(this.procedure);
    //       this.snackBar.open(`Procedure submitted`, 'Close', { duration: 3000 });
    //     }
    //   }, error => {
    //     ConsoleLogger.printError('Failed to save Procedure', error);
    //     this.snackBar.open(`Something went wrong`, 'Close');
    //   });
  }

  onResolved(procedure: Procedure) {
    this.resolved = true;
    console.log(procedure);
  }

  canSubmit() {
    return this.open && 
      this.procedure.tasks?.filter(task => task.response === undefined).length == 0;;
  }

}
