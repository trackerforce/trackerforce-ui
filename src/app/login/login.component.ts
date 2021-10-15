import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { ConsoleLogger } from '../_helpers/console-logger';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();

    loginForm!: FormGroup;
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
            this.router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {
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
        }).pipe(takeUntil(this.unsubscribe)).subscribe(success => {
            if (success) {
                this.router.navigateByUrl(this.returnUrl || "/" + this.authService.getUserInfo('tenant'));
                this.authService.releaseOldSessions.emit(true);
            }
        }, error => {
            ConsoleLogger.printError(error);
            this.error = error;
        });
    }

    private onSubmitAgent() {
        this.authService.login({
            email: this.f.email.value,
            password: this.f.password.value
        }).pipe(takeUntil(this.unsubscribe)).subscribe(success => {
            if (success) {
                this.router.navigateByUrl(this.returnUrl || "/");
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
        if (this.loginForm?.invalid)
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

        if (this.type)
            this.loginForm.get('tenant')?.setValidators([Validators.required]);
        else
            this.loginForm.get('tenant')?.setValidators([]);

        this.loginForm.get('tenant')?.updateValueAndValidity();
    }

}

