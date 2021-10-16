import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-create',
  templateUrl: './agent-create.component.html',
  styleUrls: ['./agent-create.component.scss']
})
export class AgentCreateComponent implements OnInit {

  agentForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.agentForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.agentForm?.invalid)
      return;
  }

}
