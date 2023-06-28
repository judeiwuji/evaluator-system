import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/Auth.model';
import Feedback from '../models/interface/Feedback.interface';
import { User } from '../models/interface/User.interface';
import LinkManager from '../models/LinkManager.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = `${LinkManager.baseUrl}/api/`;
  private ACCESS_TOKEN_KEY = 'access-token';
  private user: User | undefined;

  constructor(
    protected http: HttpClient,
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  login(request: LoginRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}login`, request);
  }

  logout() {
    this.toastr.info('Logging Out...', '', { disableTimeOut: true });
    this.http.post(`${this.API_URL}logout`, {}).subscribe(() => {
      this.toastr.clear();
      this.removeAccessToken();
      this.router.navigate(['/login']);
    });
  }

  currentUser(): Observable<Feedback> {
    return this.http.get(`${this.API_URL}current/user`);
  }

  get isLoggedIn() {
    return this.accessToken ? true : false;
  }

  get accessToken() {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY);
  }

  set accessToken(token: string) {
    console.log(typeof token);
    this.removeAccessToken();
    this.cookieService.put(this.ACCESS_TOKEN_KEY, token, {
      secure: true,
      path: '/',
      expires: '1h',
    });
  }

  removeAccessToken() {
    this.cookieService.remove(this.ACCESS_TOKEN_KEY, { path: '/' });
  }

  getUserType() {
    let token = this.accessToken;
    let userType = '';
    if (token) {
      const decoded: any = jwt_decode(token);
      userType = decoded['type'];
    }
    return userType;
  }
}
