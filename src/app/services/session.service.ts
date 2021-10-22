import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable, PaginablePredict } from '../models/paginable';
import { Case } from '../models/case';
import { Procedure } from '../models/procedure';

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

  public getCase(protocol: string): Observable<Case> {
    return this.http.get<Case>(`${environment.sessionServiceUrl}/session/case/v1/protocol/${protocol}`)
      .pipe(catchError(super.handleError));
  }

  public saveProcedure(caseId: string, procedure: Procedure): Observable<Case> {
    return this.http.post<Case>(`${environment.sessionServiceUrl}/session/case/v1/handler`, {
      case: caseId,
      procedure: procedure.id,
      event: 'SAVE',
      tasks: procedure!.tasks!.map(task => {
        return {
          id: task.id,
          response: task.response
        }
      })
    }).pipe(catchError(super.handleError));
  }

  public submitProcedure(caseId: string, procedureId: string): Observable<Case> {
    return this.http.post<Case>(`${environment.sessionServiceUrl}/session/case/v1/handler`, {
      case: caseId,
      procedure: procedureId,
      event: 'SUBMIT'
    }).pipe(catchError(super.handleError));
  }

  public acceptedNextProcedure(caseId: string, procedureId: string, selectedProcedureId: string): Observable<Case> {
    return this.http.post<Case>(`${environment.sessionServiceUrl}/session/case/v1/handler`, {
      case: caseId,
      procedure: procedureId,
      resolution: selectedProcedureId,
      event: 'NEXT'
    }).pipe(catchError(super.handleError));
  }

  public listAndPredict(caseId: string, procedureId: string): Observable<PaginablePredict<Procedure>> {
    return this.http.post<PaginablePredict<Procedure>>(`${environment.sessionServiceUrl}/session/case/v1/next`, {
      case: caseId,
      procedure: procedureId,
    }).pipe(catchError(super.handleError));
  }

}
