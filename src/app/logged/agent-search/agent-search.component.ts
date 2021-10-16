import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agent-search',
  templateUrl: './agent-search.component.html',
  styleUrls: ['./agent-search.component.scss']
})
export class AgentSearchComponent implements OnInit {

  agentForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder
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
  }

}
