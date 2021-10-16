import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-agent-create',
  templateUrl: './agent-create.component.html',
  styleUrls: ['./agent-create.component.scss']
})
export class AgentCreateComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  agentForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private agentService: AgentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.agentForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.agentForm?.invalid)
      return;

    this.agentService.createAgent({ 
      name: this.agentForm.get('name')?.value,
      email: this.agentForm.get('email')?.value  
    }).pipe(takeUntil(this.unsubscribe)).subscribe(agent => {
      if (agent) {
        this.snackBar.open(`Access code: ${agent.temp_access}`, 'Close');
        this.agentService.agent.next(undefined);
      }
    }, error => {
      ConsoleLogger.printError('Failed to create Agent', error);
      this.error = error;
    });
  }

}
