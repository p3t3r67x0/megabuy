import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private BASE_URL: string;
  private headers: Headers;

  isLoggedIn: boolean;
  token: string;
  users: User[];

  constructor(private http: Http, private auth: AuthService) {
    this.BASE_URL = 'http://localhost:5000';
    this.headers = new Headers({ 'content-type': 'application/json' });
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    const token = localStorage.getItem('token');

    this.loadUser(token)
      .then((user) => {
        console.log(user.json());
        this.users = user.json().users;
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  loadUser(token) {
    let url: string;
    let headers: Headers;

    url = `${this.BASE_URL}/user`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }
}
