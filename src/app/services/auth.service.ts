import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private url: string;
  private headers: Headers;
  isLoggedIn: boolean;

  constructor(private http: Http) {
    this.url = environment.apiUrl;
    this.headers = new Headers({ 'content-type': 'application/json' });
  }

  login(user): Promise<any> {
    let url: string;
    let headers: Headers;

    headers = new Headers();
    url = `${this.url}/api/login`;
    headers.append('Authorization', 'Basic ' + btoa(user.email + ':' + user.password));
    return this.http.post(url, user, { headers: headers }).toPromise();
  }

  logout(user, token): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/logout`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(url, user, { headers: headers }).toPromise();
  }

  register(user): Promise<any> {
    let url: string;
    url = `${this.url}/api/user`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }

  loginStatus(token): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/status`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }

}
