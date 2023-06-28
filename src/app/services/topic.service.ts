import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import {
  CreateTopicRequest,
  UpdateTopicRequest,
} from '../models/interface/Topic.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateTopicRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}topic`, request);
  }

  findAll(
    page = 1,
    courseId: number,
    search?: string,
    paginate = true
  ): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}topics?page=${page}&cid=${courseId}&search=${
        search ? search : ''
      }&paginate=${paginate}`
    );
  }

  findOne(id: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}topic/${id}`);
  }

  findAndUpdate(request: UpdateTopicRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}topic`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}topic`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }
}
