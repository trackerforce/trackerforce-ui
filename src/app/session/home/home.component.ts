import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Template } from 'src/app/models/template';
import { SessionService } from 'src/app/services/session.service';
import { TemplateService } from 'src/app/services/template.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  sessionForm!: FormGroup;
  error: string = '';
  type: boolean = false;
  loading: boolean = false;

  templates!: Template[];
  filteredOptions!: Observable<Template[]>;

  constructor(
    private formBuilder: FormBuilder,
    private templateService: TemplateService,
    private sessionService: SessionService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.sessionForm = this.formBuilder.group({
      selectedOption: ['new_case', [Validators.required]],
      protocol: [''],
      template: ['']
    });

    this.filteredOptions = this.sessionForm.get('template')!.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => this.filter(value || ''))
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private filter(value: string): Observable<Template[]> {
    return this.templateService.listTemplates({ name: value })
      .pipe(
        takeUntil(this.unsubscribe),
        map(response => response.data)
      )
  }

  private onSubmitNewCase() {
    const template: Template = this.sessionForm.get('template')!.value;
    
    this.loading = true;
    this.sessionService.createCase(template.id!, this.authService.getUserInfo('sessionid'))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        if (data)
          this.router.navigate([`${this.authService.getSessionOrgPath()}/case/${data.protocol}`]);

        this.loading = false;
      }, error => {
        ConsoleLogger.printError('Failed to create new Case', error);
        this.error = error.error;
        this.loading = false;
      });
  }

  private onSubmitOpenCase() {
    const caseProtocol = this.sessionForm.get('protocol')?.value;
    this.router.navigate([`${this.authService.getSessionOrgPath()}/case/${caseProtocol}`]);
  }

  displayFn(template: Template): string {
    return template && template.name ? template.name : '';
  }

  onSubmit() {
    if (this.sessionForm?.invalid)
      return;

    if (this.type)
      this.onSubmitOpenCase();
    else
      this.onSubmitNewCase();
  }

  onKey(_event: any) {
    this.error = '';
  }

  onChangeType() {
    this.type = this.sessionForm.get('selectedOption')?.value == 'open_case';

    const protocolCtrl = this.sessionForm.get('protocol')!;
    const templateCtrl = this.sessionForm.get('template')!;

    protocolCtrl.setValidators(this.type ? Validators.required : []);
    templateCtrl.setValidators(this.type ? [] : Validators.required);

    protocolCtrl.updateValueAndValidity();
    templateCtrl.updateValueAndValidity();
  }

}

