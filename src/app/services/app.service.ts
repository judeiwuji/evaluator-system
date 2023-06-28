import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ChangePasswordRequest,
  ResetPasswordRequest,
} from '../models/interface/App.interface';
import Feedback from '../models/interface/Feedback.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  getLevels(): Observable<Feedback> {
    return this.http.get(`${this.API_URL}levels`);
  }

  changePassword(request: ChangePasswordRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}change/password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}reset/password`, request);
  }
}
