import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-agent-search',
  templateUrl: './agent-search.component.html',
  styleUrls: ['./agent-search.component.scss']
})
export class AgentSearchComponent implements OnInit {

  agentForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private agentService: AgentService
  ) { }

  ngOnInit(): void {
    this.agentForm = this.formBuilder.group({
      email: [''],
      name: ['']
    });
  }

  onSubmit() {
    if (this.agentForm?.invalid)
      return;

    this.agentService.agent.next({
      name: this.agentForm.get('name')?.value,
      email: this.agentForm.get('email')?.value
    });
  }

  onClear() {
    this.agentForm.reset();
    this.agentForm.clearValidators();
    this.agentService.agent.next({});
  }

}
