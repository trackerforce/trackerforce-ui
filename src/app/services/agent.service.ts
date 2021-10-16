import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Paginable } from '../models/paginable';
import { Agent } from '../models/agent';

@Injectable({
  providedIn: 'root'
})
export class AgentService extends ApiService {

  public agent = new Subject<Agent>();

  constructor(private http: HttpClient) {
    super();
  }

  public listAgents(agent?: Agent): Observable<Paginable<Agent>> {
    let params = this.paramFromObject(agent);
    return this.http.get<Paginable<Agent>>(`${environment.managementServiceUrl}/management/agent/v1/`, { params })
      .pipe(catchError(super.handleError));
  }

  public createAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(`${environment.managementServiceUrl}/management/agent/v1/create`, agent)
      .pipe(catchError(super.handleError));
  }

}
