import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
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

  constructor(private http: Http, private data: DataService, private auth: AuthService) {
    this.BASE_URL = 'http://localhost:5000';
    this.headers = new Headers({ 'content-type': 'application/json' });
    this.changeStatus();
  }

  ngOnInit() {
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);

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

  changeStatus() {
    this.data.changeStatus(true);
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
