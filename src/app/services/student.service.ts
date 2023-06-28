import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import {
  CreateStudentRequest,
  UpdateStudentRequest,
} from '../models/interface/Student.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private API_URL = `${LinkManager.apiUrl}student`;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateStudentRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}`, request);
  }

  findAll(page = 1, search?: string): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}s?page=${page}&search=${search ? search : ''}`
    );
  }

  findAndUpdate(request: UpdateStudentRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  getStudentQuizzesResults(
    studentId: number | undefined
  ): Observable<Feedback> {
    return this.http.get(`${this.API_URL}/quizzes/result/`, {
      params: { studentId: studentId as number },
    });
  }
}
