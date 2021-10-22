import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable } from '../models/paginable';
import { Case } from '../models/case';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends ApiService {

  constructor(private http: HttpClient) {
    super();
  }

  public listAgentCases(sessionid: string, pageSetup: PageSetup): Observable<Paginable<Case>> {
    pageSetup.output = 'id,createdAt,protocol,description,context,procedures.status,procedures.description';
    let params = this.paramFromObject(pageSetup);
    
    return this.http.get<Paginable<Case>>(`${environment.sessionServiceUrl}/session/case/v1/agent/${sessionid}`, { params })
      .pipe(catchError(super.handleError));
  }

  public createCase(templateId: string, sessionId: string): Observable<Case> {
    return this.http.post<Case>(`${environment.sessionServiceUrl}/session/case/v1`, {
      agent_id: sessionId,
      template: templateId
    }).pipe(catchError(super.handleError));
  }

  public getCase(protocol: string) {
    return this.http.get<Case>(`${environment.sessionServiceUrl}/session/case/v1/protocol/${protocol}`)
      .pipe(catchError(super.handleError));
  }

}
