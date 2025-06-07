import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Agent } from 'src/app/models/agent';
import { AgentService } from 'src/app/services/agent.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.scss'],
  standalone: false
})
export class AgentEditComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly agentService = inject(AgentService);

  private readonly unsubscribe = new Subject();
  private _agentid = '';

  loading = true;
  agentForm!: FormGroup;
  error = '';
  agent?: Agent = undefined;

  constructor() { 
    this.route.params.subscribe(params => this._agentid = params.agentid);
  }

  ngOnInit(): void {
    this.agentForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.loading = true;
    this.agentService.getAgent(this._agentid)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: agent => {
          this.agent = agent;
          this.agentForm.get('name')?.setValue(this.agent.name);
          this.agentForm.get('email')?.setValue(this.agent.email);
        },
        error: error => {
          ConsoleLogger.printError('Failed to load Agent', error);
          this.error = error.error;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.agentForm?.invalid)
      return;

    return this.router.navigate([`${this.authService.getManagementOrgPath()}/agents`]);
  }

  onCancel() {
    return this.router.navigate([`${this.authService.getManagementOrgPath()}/agents`]);
  }

}
