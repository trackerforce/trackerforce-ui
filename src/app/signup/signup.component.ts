import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { ConsoleLogger } from '../_helpers/console-logger';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false
})
export class SignupComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly unsubscribe = new Subject();

  signupForm!: FormGroup;
  returnUrl: string | undefined;
  error = '';
  type = false;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.signupForm = this.formBuilder.group({
      tenant: ['', [Validators.required]],
      selectedLoginType: ['admin', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      temp_password: []
    });
  }

  get f() {
    return this.signupForm?.controls;
  }

  private onSubmitAdmin() {
    this.authService.signup({
      email: this.f.email.value,
      password: this.f.password.value
    }, 
    this.f.tenant.value).pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: success => this.onSuccess(success),
        error: error => {
          ConsoleLogger.printError(error);
          this.error = error;
        }
      });
  }

  private onSubmitAgent() {
    this.authService.signupAgent({
      email: this.f.email.value,
      password: this.f.password.value,
      access_code: this.f.temp_password.value
    }, 
    this.f.tenant.value).pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: success => this.onSuccess(success),
        error: error => {
          ConsoleLogger.printError(error);
          this.error = error;
        }
      });
  }

  private onSuccess(success: boolean) {
    if (success) {
      this.router.navigateByUrl('/login');
      this.authService.releaseOldSessions.emit(true);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onSubmit() {
    if (this.signupForm?.invalid)
      return;

    if (this.type)
      this.onSubmitAgent();
    else
      this.onSubmitAdmin();
  }

  onKey(_event: Event) {
    this.error = '';
  }

  onChangeType() {
    this.type = this.f.selectedLoginType.value == 'agent'

    const tempPassword = this.signupForm.get('temp_password')!;
    if (this.type)
      tempPassword.setValidators([Validators.required]);
    else
      tempPassword.setValidators([]);

    tempPassword.updateValueAndValidity();
  }

}
