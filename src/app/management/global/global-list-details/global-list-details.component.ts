import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Global } from 'src/app/models/global';
import { GlobalService } from 'src/app/services/global.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-global-list-details',
  templateUrl: './global-list-details.component.html',
  styleUrls: ['./global-list-details.component.scss'],
  standalone: false
})
export class GlobalListDetailsComponent implements OnInit, OnDestroy {
  private readonly unsubscribe: Subject<void> = new Subject();

  @Input() global?: Global
  globalForm!: FormGroup;
  error: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const attributes: any = {};
    this.getAttributes().forEach(attrib => 
      attributes[attrib] = [this.global?.attributes[attrib], Validators.required]);

    this.globalForm = this.formBuilder.group(attributes);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.globalForm?.invalid)
      return;

    this.getAttributes().forEach(attrib => {
      this.global!.attributes[attrib] = this.globalForm.get(attrib)?.value;
    });

    this.globalService.updateGlobal(this.global!)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: global => {
          this.global = global;
          this.snackBar.open(`Feature updated`, 'Close', { duration: 2000 });
        },
        error: error => {
          ConsoleLogger.printError('Failed to update feature', error);
          this.error = error.error;
        }
      });
  }

  getAttributes(): string[] {
    return Object.keys(this.global?.attributes);
  }

}
