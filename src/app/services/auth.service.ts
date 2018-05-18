import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from '../models/user';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private BASE_URL: string;
  private headers: Headers;
  isLoggedIn: boolean;

  constructor(private http: Http) {
    this.BASE_URL = 'http://localhost:5000';
    this.headers = new Headers({ 'content-type': 'application/json' });
  }

  login(user): Promise<any> {
    let url: string;
    let headers: Headers;

    headers = new Headers();
    url = `${this.BASE_URL}/login`;
    headers.append('Authorization', 'Basic ' + btoa(user.email + ':' + user.password));
    return this.http.post(url, user, { headers: headers }).toPromise();
  }

  logout(user, token): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.BASE_URL}/logout`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(url, user, { headers: headers }).toPromise();
  }

  register(user): Promise<any> {
    let url: string;
    url = `${this.BASE_URL}/user`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }

  loginStatus(token): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.BASE_URL}/status`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }

}
