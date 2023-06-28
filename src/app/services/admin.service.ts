import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateAdminRequest,
  UpdateAdminRequest,
} from 'server/models/Admin.model';
import Feedback from '../models/interface/Feedback.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateAdminRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}admin`, request);
  }

  findAll(page = 1, search?: string): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}admins?page=${page}&search=${search ? search : ''}`
    );
  }

  findAndUpdate(request: UpdateAdminRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}admin`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}admin`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  getAdminDashboardStats(): Observable<Feedback> {
    return this.http.get(`${this.API_URL}admin/dashboard/stats`);
  }
}
