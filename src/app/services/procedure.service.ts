import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable } from '../models/paginable';
import { Helper } from '../models/helper';
import { Procedure } from '../models/procedure';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService extends ApiService {

  public procedure = new Subject<Procedure>();

  constructor(private http: HttpClient) {
    super();
  }

  public listProcedures(procedure?: Procedure, pageSetup?: PageSetup): Observable<Paginable<Procedure>> {
    let params = this.paramFromObject(procedure);
    params = this.paramFromObject(pageSetup, params);
    
    return this.http.get<Paginable<Procedure>>(`${environment.managementServiceUrl}/management/procedure/v1/`, { params })
      .pipe(catchError(super.handleError));
  }

  public getProcedure(id: string) {
    return this.http.get<Procedure>(`${environment.managementServiceUrl}/management/procedure/v1/${id}`)
      .pipe(catchError(super.handleError));
  }

  public createProcedure(procedure: Procedure, helper: Helper): Observable<Procedure> {
    let body: any = { procedure };

    if (helper.content)
      body.helper = helper;

    return this.http.post<Procedure>(`${environment.managementServiceUrl}/management/procedure/v1/create`, body)
      .pipe(catchError(super.handleError));
  }

  public updateProcedure(procedure: Procedure, helper: Helper): Observable<Procedure> {
    return this.http.patch<Procedure>(`${environment.managementServiceUrl}/management/procedure/v1/${procedure.id}`, { 
      procedure: {
        name: procedure.name,
        description: procedure.description
      },
      helper
    }).pipe(catchError(super.handleError));
  }

}
