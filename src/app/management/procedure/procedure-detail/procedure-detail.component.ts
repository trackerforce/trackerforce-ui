import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Helper } from 'src/app/models/helper';
import { Procedure } from 'src/app/models/procedure';
import { Task } from 'src/app/models/task';
import { ProcedureService } from 'src/app/services/procedure.service';

@Component({
  selector: 'app-procedure-detail',
  templateUrl: './procedure-detail.component.html',
  styleUrls: ['./procedure-detail.component.scss']
})
export class ProcedureDetailComponent implements OnInit, AfterViewInit {
  @Input() procedure!: Procedure;
  @Output() procedureChanged = new EventEmitter<Procedure>();

  tasksSubject = new Subject<Task[]>();
  procedureForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private procedureService: ProcedureService
  ) { }

  ngOnInit(): void {
    this.procedureService.procedure.subscribe(procedure => {
      this.procedure = procedure;
      this.procedureForm.reset();
      this.tasksSubject.next(this.procedure.tasks);
    });

    this.procedureForm = this.formBuilder.group({
      name: [this.procedure.name, Validators.required],
      description: [this.procedure.description, Validators.required],
      hook: [this.procedure.hook!.resolverUri]
    });

    this.procedureForm.valueChanges.subscribe(procedure => {
      this.procedure.name = procedure.name;
      this.procedure.description = procedure.description;
      this.procedure.hook = { resolverUri: procedure.hook }
      this.procedureChanged.emit(this.procedure);
    });
  }

  ngAfterViewInit(): void {
    this.tasksSubject.next(this.procedure.tasks);
  }

  onHelperChanged(helper: Helper) {
    this.procedure.helper = helper;
    this.procedureChanged.emit(this.procedure);
  }

  onSelectTask(selectedTask: Task) {
    if (!this.procedure.tasks)
      this.procedure.tasks = [];

    if (!this.procedure.tasks!.filter(task => task.id === selectedTask.id).length || 
      this.procedure.tasks.length === 0) {
      this.procedure.tasks!.push(selectedTask);
      this.tasksSubject.next(this.procedure.tasks!);
      this.procedureChanged.emit(this.procedure);
    }
  }

  onRemoveTask(task: Task) {
    this.procedure.tasks = this.procedure?.tasks!.filter(t => t.id !== task.id);
    this.procedureChanged.emit(this.procedure);
  }
  
  hasTasks(): boolean {
    return this.procedure.tasks! && this.procedure.tasks.length > 0;
  }

}