import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PageSetup, Paginable } from '../models/paginable';
import { Task } from '../models/task';
import { Helper } from '../models/helper';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends ApiService {

  public task = new Subject<Task>();

  constructor(private http: HttpClient) {
    super();
  }

  public listTasks(agent?: Task, pageSetup?: PageSetup): Observable<Paginable<Task>> {
    let params = this.paramFromObject(agent);
    params = this.paramFromObject(pageSetup);

    return this.http.get<Paginable<Task>>(`${environment.managementServiceUrl}/management/task/v1/`, { params })
      .pipe(catchError(super.handleError));
  }

  public getTask(id: string) {
    return this.http.get<Task>(`${environment.managementServiceUrl}/management/task/v1/${id}`)
      .pipe(catchError(super.handleError));
  }

  public createTask(task: Task, helper: Helper): Observable<Task> {
    return this.http.post<Task>(`${environment.managementServiceUrl}/management/task/v1/create`, {
      task: task,
      helper: helper
    }).pipe(catchError(super.handleError));
  }

}
