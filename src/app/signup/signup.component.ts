import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { ConsoleLogger } from '../_helpers/console-logger';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  signupForm!: FormGroup;
  returnUrl: string | undefined;
  error: string = '';
  type: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
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
    }, this.f.tenant.value).pipe(takeUntil(this.unsubscribe)).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/login');
        this.authService.releaseOldSessions.emit(true);
      }
    }, error => {
      ConsoleLogger.printError(error);
      this.error = error;
    });
  }

  private onSubmitAgent() {
    this.authService.signupAgent({
      email: this.f.email.value,
      password: this.f.password.value,
      access_code: this.f.temp_password.value
    }, this.f.tenant.value).pipe(takeUntil(this.unsubscribe)).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/login');
        this.authService.releaseOldSessions.emit(true);
      }
    }, error => {
      ConsoleLogger.printError(error);
      this.error = error;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
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

  onKey(event: any) {
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
