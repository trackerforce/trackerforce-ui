import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  standalone: false
})
export class GlobalSearchComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly globalService = inject(GlobalService);

  globalForm!: FormGroup;
  error = '';

  ngOnInit(): void {
    this.globalForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.globalForm?.invalid)
      return;

    this.globalService.global.next({
      description: this.globalForm.get('description')?.value
    });
  }

  onClear() {
    this.globalForm.reset();
    this.globalForm.clearValidators();
    this.globalService.global.next({});
  }

}
