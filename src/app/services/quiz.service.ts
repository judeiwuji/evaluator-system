import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import {
  CreateQuizRequest,
  UpdateQuizRequest,
  ValidateQuizTokenRequest,
} from '../models/interface/Quiz.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateQuizRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}quiz`, request);
  }

  findAll(
    page = 1,
    topicId: number,
    search?: string,
    active = false
  ): Observable<Feedback> {
    return this.http.get(`${this.API_URL}quizzes`, {
      params: { page, tid: topicId, search: search ? search : '', active },
    });
  }

  findOne(option: { id?: number; token?: string }): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}quiz/?id=${option.id ? option.id : ''}&token=${
        option.token ? option.token : ''
      }`
    );
  }

  findAndUpdate(request: UpdateQuizRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}quiz`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}quiz`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  findQuizResults(quizId: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}quiz/results/${quizId}`);
  }

  generateQuizReport(quizId: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}quiz/report/${quizId}`);
  }

  validateQuizToken(request: ValidateQuizTokenRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}quiz/validate/token/`, request);
  }
}
