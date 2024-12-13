import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable } from '../models/paginable';
import { Global } from '../models/global';

@Injectable({
  providedIn: 'root'
})
export class GlobalService extends ApiService {

  public global = new Subject<Global>();

  constructor(private readonly http: HttpClient) {
    super();
  }

  public listGlobals(global?: Global, pageSetup?: PageSetup): Observable<Paginable<Global>> {
    let params = this.paramFromObject(global);
    params = this.paramFromObject(pageSetup, params);
    
    return this.http.get<Paginable<Global>>(`${environment.managementServiceUrl}/management/global/v1/`, { params })
      .pipe(catchError(super.handleError));
  }

  public listAvailableGlobals(): Observable<Global[]> {
    return this.http.get<Global[]>(`${environment.managementServiceUrl}/management/global/v1/list`)
      .pipe(catchError(super.handleError));
  }

  public createGlobal(global: Global): Observable<Global> {
    return this.http.post<Global>(`${environment.managementServiceUrl}/management/global/v1/create`, { global })
      .pipe(catchError(super.handleError));
  }

  public updateGlobal(global: Global): Observable<Global> {
    return this.http.patch<Global>(`${environment.managementServiceUrl}/management/global/v1/${global.id}`, { 
      global: { attributes: global.attributes }
    }).pipe(catchError(super.handleError));
  }

}
