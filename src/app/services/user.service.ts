import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import { UpdateUserRequest } from '../models/interface/User.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  findAllActivities(month: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}user/activities/${month}`);
  }

  findAndUpdate(request: UpdateUserRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}user/`, request);
  }

  findAndDeleteActivity(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}user/activity`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }

  uploadAvatar(formdata: FormData): Observable<Feedback> {
    return this.http.post(`${this.API_URL}user/upload`, formdata);
  }
}
