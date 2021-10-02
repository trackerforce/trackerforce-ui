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
    loading = false;
    forgotPassword = false;
    returnUrl: string | undefined;
    error: string = '';
    success: string = '';
    status: string = '';

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
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    get f() {
        return this.loginForm?.controls;
    }

    onSubmit() {
        if (this.loginForm?.invalid || this.forgotPassword) {
            return;
        }

        this.loading = true;

        this.authService.login({
            username: this.f?.username.value,
            password: this.f?.password.value
        }).pipe(takeUntil(this.unsubscribe)).subscribe(success => {
            if (success) {
                this.router.navigateByUrl(this.returnUrl || "/");
                this.authService.releaseOldSessions.emit(true);
            }
            this.loading = false;
        }, error => {
            ConsoleLogger.printError(error);
            this.error = error;
            this.loading = false;
        }
        );
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onKey(event: any) {
        this.error = '';
    }

    onForgotPassword() {
        this.forgotPassword = true;
    }

}

