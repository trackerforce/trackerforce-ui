import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Paginable } from '../models/paginable';
import { Agent } from '../models/agent';

@Injectable({
  providedIn: 'root'
})
export class AgentService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  public listAgents(): Observable<Paginable<Agent>> {
    return this.http.get<Paginable<Agent>>(`${environment.managementServiceUrl}/management/agent/v1/`)
      .pipe(catchError(super.handleError));
  }

}
