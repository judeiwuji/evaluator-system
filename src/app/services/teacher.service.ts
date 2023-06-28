import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import {
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from '../models/interface/Teacher.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateTeacherRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}teacher`, request);
  }

  findAll(page = 1, search?: string): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}teachers?page=${page}&search=${search ? search : ''}`
    );
  }

  findAndUpdate(request: UpdateTeacherRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}teacher`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}teacher`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  getTeacherDashboardStats(): Observable<Feedback> {
    return this.http.get(`${this.API_URL}teacher/dashboard/stats`);
  }
}
