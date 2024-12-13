import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Global } from 'src/app/models/global';
import { GlobalService } from 'src/app/services/global.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-global-create',
  templateUrl: './global-create.component.html',
  styleUrls: ['./global-create.component.scss'],
  standalone: false
})
export class GlobalCreateComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();
  
  selectedGlobal!: Global;
  globalForm!: FormGroup;
  error: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.globalForm = this.formBuilder.group({});
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  selectGlobal(selectedGlobal: Global) {
    this.selectedGlobal = selectedGlobal;

    const attributes: any = {};
    this.getAttributes().forEach(attrib => 
      attributes[attrib] = ['', Validators.required]);

    this.globalForm = this.formBuilder.group(attributes);
  }

  onSubmit() {
    if (this.globalForm?.invalid)
      return;

    const attributes: any = {};
    this.getAttributes().forEach(attrib => attributes[attrib] = this.globalForm.get(attrib)?.value);
    this.globalService.createGlobal({
      key: this.selectedGlobal.key,
      attributes
    }).pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: _global => {
          this.snackBar.open(`New feature has succesfully added`, 'Close', { duration: 2000 });
          this.globalService.global.next(_global);
        },
        error: error => {
          ConsoleLogger.printError('Failed to create Global', error);
          this.error = error.error;
        }
      });
  }

  getAttributes(): string[] {
    return this.selectedGlobal.attributes;
  }

}
