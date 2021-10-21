import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable } from '../models/paginable';
import { Helper } from '../models/helper';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService extends ApiService {

  public template = new Subject<Template>();

  constructor(private http: HttpClient) {
    super();
  }

  public listTemplates(template?: Template, pageSetup?: PageSetup): Observable<Paginable<Template>> {
    let params = this.paramFromObject(template);
    params = this.paramFromObject(pageSetup, params);
    
    return this.http.get<Paginable<Template>>(`${environment.managementServiceUrl}/management/template/v1/`, { params })
      .pipe(catchError(super.handleError));
  }

  public getTemplate(id: string) {
    return this.http.get<Template>(`${environment.managementServiceUrl}/management/template/v1/${id}`)
      .pipe(catchError(super.handleError));
  }

  public createTemplate(template: Template, helper: Helper): Observable<Template> {
    return this.http.post<Template>(`${environment.managementServiceUrl}/management/template/v1/create`, {
      template: template,
      helper: helper
    }).pipe(catchError(super.handleError));
  }

  public updateTemplate(template: Template, helper: Helper): Observable<Template> {
    return this.http.patch<Template>(`${environment.managementServiceUrl}/management/template/v1/${template.id}`, { 
      template: {
        name: template.name,
        description: template.description
      },
      helper
    }).pipe(catchError(super.handleError));
  }

}
