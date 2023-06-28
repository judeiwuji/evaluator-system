import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateCourseRequest,
  UpdateCourseRequest,
} from '../models/interface/Course.interface';
import Feedback from '../models/interface/Feedback.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateCourseRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}course`, request);
  }

  findAll(
    page = 1,
    teacherId: number,
    search?: string,
    paginate = true
  ): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}courses?page=${page}&tid=${teacherId}&search=${
        search ? search : ''
      }&paginate=${paginate}`
    );
  }

  findOne(id: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}course/${id}`);
  }

  findAndUpdate(request: UpdateCourseRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}course`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}course`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }
}
