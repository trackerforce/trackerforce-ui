import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { ConsoleLogger } from '../_helpers/console-logger';
import { MatCard, MatCardImage, MatCardContent } from '@angular/material/card';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatFormField, MatInput, MatError } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [MatCard, MatCardImage, MatCardContent, ReactiveFormsModule, MatRadioGroup, MatRadioButton, MatFormField, MatInput, MatError, MatButton]
})
export class LoginComponent implements OnInit, OnDestroy {
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    private readonly unsubscribe = new Subject();

    loginForm!: FormGroup;
    returnUrl: string | undefined;
    error = '';
    type = false;

    ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/']);
        }

        this.loginForm = this.formBuilder.group({
            selectedLoginType: ['admin', [Validators.required]],
            email: ['', [Validators.required]],
            password: ['', Validators.required],
            tenant: []
        });
    }

    get f() {
        return this.loginForm?.controls;
    }

    private onSubmitAdmin() {
        this.authService.login({
            email: this.f?.email.value,
            password: this.f?.password.value
        })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
            next: success => this.onSuccess(success),
            error: error => {
                ConsoleLogger.printError(error);
                this.error = error;
            }
        });
    }

    private onSubmitAgent() {
        this.authService.loginAgent({
            email: this.f.email.value,
            password: this.f.password.value
        }, this.f.tenant.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
            next: success => this.onSuccess(success),
            error: error => {
                ConsoleLogger.printError(error);
                this.error = error;
            }
        });
    }

    private onSuccess(success: boolean) {
        if (!success) return;
        this.router.navigateByUrl(this.returnUrl ?? this.authService.getManagementOrgPath());
        this.authService.releaseOldSessions.emit(true);
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }

    onSubmit() {
        if (this.loginForm?.invalid)
            return;

        if (this.type)
            this.onSubmitAgent();
        else
            this.onSubmitAdmin();
    }

    onKey(_event: any) {
        this.error = '';
    }

    onChangeType() {
        this.type = this.f.selectedLoginType.value == 'agent'

        const tenant = this.loginForm.get('tenant')!;
        if (this.type)
            tenant.setValidators([Validators.required]);
        else
            tenant.setValidators([]);

        tenant.updateValueAndValidity();
    }

}

