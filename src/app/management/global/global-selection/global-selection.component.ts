import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Global } from 'src/app/models/global';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-global-selection',
  templateUrl: './global-selection.component.html',
  styleUrls: ['./global-selection.component.scss'],
  standalone: false
})
export class GlobalSelectionComponent implements OnInit, OnDestroy {
  private readonly globalService = inject(GlobalService);

  private readonly unsubscribe = new Subject();
  
  @Output() selectedGlobal = new EventEmitter<Global>();
  globals!: Global[];

  error = '';
  globalForm = new FormControl();
  filteredOptions!: Observable<Global[]>;

  ngOnInit(): void {
    this.globalService.listAvailableGlobals()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: globals => {
          this.globals = globals;
          setTimeout(() => this.loadFilteredOptions(), 100);
        },
        error: error => this.error = error
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  onSubmit() {
    this.selectedGlobal.emit(this.globalForm.value);
  }

  displayFn(global: Global): string {
    return global?.description ?? '';
  }

  private loadFilteredOptions() {
    this.filteredOptions = this.globalForm.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filter(name) : this.globals.slice())
      );
  }

  private filter(value: string): Global[] {
    const filterValue = value.toLowerCase();
    return this.globals?.filter(g => g.description?.toLowerCase().includes(filterValue));
  }

}
