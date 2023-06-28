import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import {
  CreateOptionRequest,
  CreateQuestionRequest,
  UpdateOptionRequest,
  UpdateQuestionRequest,
} from '../models/interface/Question.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateQuestionRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}question`, request);
  }

  findAll(
    page = 1,
    quizId: number,
    search?: string,
    paginate = true,
    time = 0
  ): Observable<Feedback> {
    return this.http.get(`${this.API_URL}questions`, {
      params: {
        page,
        qid: quizId,
        search: search ? search : '',
        paginate,
        time,
      },
    });
  }

  findOne(id: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}question/${id}`);
  }

  findAndUpdate(request: UpdateQuestionRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}question`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}question`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  createOption(request: CreateOptionRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}question/option`, request);
  }

  findAndUpdateOption(request: UpdateOptionRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}question/option`, request);
  }

  findAndDeleteOption(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}question/option`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  uploadQuestions(formdata: FormData): Observable<Feedback> {
    return this.http.post(`${this.API_URL}questions/upload/`, formdata);
  }
}
