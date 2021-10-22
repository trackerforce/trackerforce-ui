import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Case } from 'src/app/models/case';
import { SessionService } from 'src/app/services/session.service';
import { ConsoleLogger } from 'src/app/_helpers/console-logger';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class IndexHomeComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  private protocol!: string;
  
  loading = true;
  error: string = '';
  sessionCase!: Case;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { 
    this.route.params.subscribe(params => this.protocol = params.protocol);
  }

  ngOnInit(): void {
    this.loading = true;
    this.sessionService.getCase(this.protocol)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        if (data) {
          this.sessionCase = data;
        }
    }, error => {
      ConsoleLogger.printError('Failed to load Case', error);
      this.error = error;
    }, () => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
