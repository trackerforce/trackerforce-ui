import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable } from '../models/paginable';
import { Agent } from '../models/agent';

@Injectable({
  providedIn: 'root'
})
export class AgentService extends ApiService {

  public agent = new Subject<Agent | undefined>();

  constructor(private readonly http: HttpClient) {
    super();
  }

  public listAgents(agent?: Agent, pageSetup?: PageSetup): Observable<Paginable<Agent>> {
    let params = this.paramFromObject(agent);
    params = this.paramFromObject(pageSetup, params);

    return this.http.get<Paginable<Agent>>(`${environment.managementServiceUrl}/management/agent/v1/`, { params })
      .pipe(catchError(super.handleError));
  }

  public getAgent(id: string) {
    return this.http.get<Agent>(`${environment.managementServiceUrl}/management/agent/v1/${id}`)
      .pipe(catchError(super.handleError));
  }

  public createAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(`${environment.managementServiceUrl}/management/agent/v1/create`, agent)
      .pipe(catchError(super.handleError));
  }

  public getMe() {
    return this.http.get<Agent>(`${environment.managementServiceUrl}/management/agent/v1/me`)
      .pipe(catchError(super.handleError));
  }

  public watchCase(sessionid: string, caseid: string): Observable<Agent> {
    return this.http.post<Agent>(`${environment.managementServiceUrl}/management/agent/v1/watch/${sessionid}/${caseid}`, {})
      .pipe(catchError(super.handleError));
  }

  public unWatchCase(sessionid: string, caseid: string): Observable<Agent> {
    return this.http.post<Agent>(`${environment.managementServiceUrl}/management/agent/v1/unwatch/${sessionid}/${caseid}`, {})
      .pipe(catchError(super.handleError));
  }

}
