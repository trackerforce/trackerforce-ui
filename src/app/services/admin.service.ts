import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService {
  private readonly http = inject(HttpClient);

  public getAdmin(): Observable<Admin> {
    return this.http.get<Admin>(`${environment.identityServiceUrl}/admin/me`).pipe(catchError(super.handleError));
  }

  public getAdminById(id: string): Observable<Admin> {
    return this.http.get<Admin>(`${environment.identityServiceUrl}/admin/${id}`).pipe(catchError(super.handleError));
  }

}
