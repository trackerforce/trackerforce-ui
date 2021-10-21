import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';
import { ProcedureService } from 'src/app/services/procedure.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-procedure-edit',
  templateUrl: './procedure-edit.component.html',
  styleUrls: ['./procedure-edit.component.scss']
})
export class ProcedureEditComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private _procedureid: string = '';

  loading = true;
  action: string = 'cancel';
  procedureForm!: FormGroup;
  error: string = '';
  procedure?: Procedure = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private procedureService: ProcedureService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => this._procedureid = params.procedureid);
  }

  ngOnInit(): void {
    this.loading = true;
    
    this.procedureService.getProcedure(this._procedureid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(procedure => {
        if (procedure) {
          this.procedure = procedure;
          this.procedureForm = this.formBuilder.group({
            name: [this.procedure.name, Validators.required],
            description: [this.procedure.description, Validators.required],
            tasks: [this.procedure.tasks],
            helper_content: [this.procedure.helper?.content],
            helper_renderType: [this.procedure.helper?.renderType]
          });
        }
      }, error => {
        ConsoleLogger.printError('Failed to load Agent', error);
        this.error = error;
      }, () => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onAddTask(task: Task) {
    const tasks: Task[] = this.procedureForm.get('tasks')?.value
    tasks.push(task);
    this.procedureForm.get('tasks')?.setValue(tasks);
  }

  onRemoveTask(task: Task) {
    let tasks: Task[] = this.procedureForm.get('tasks')?.value
    tasks = tasks.filter(t => t.id !== task.id);
    this.procedureForm.get('tasks')?.setValue(tasks);
  }

  onSubmit() {
    if (this.procedureForm?.invalid)
      return;

    return this.router.navigate([`${this.authService.getManagementOrgPath()}/procedures`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/procedures`]);
  }

}