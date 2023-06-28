import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateAnswerRequest } from '../models/interface/Answer.interface';
import Feedback from '../models/interface/Feedback.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  submitAnswer(request: CreateAnswerRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}answer/`, request);
  }
}
