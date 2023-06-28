import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateDepartmentRequest } from 'server/models/Department.model';
import { CreateDepartmentRequest } from '../models/interface/Department.interface';
import Feedback from '../models/interface/Feedback.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateDepartmentRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}department`, request);
  }

  findAll(page = 1, search?: string, paginate = true): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}departments?page=${page}&search=${
        search ? search : ''
      }&paginate=${paginate}`
    );
  }

  findAnduUpdate(request: UpdateDepartmentRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}department`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}department`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }
}
