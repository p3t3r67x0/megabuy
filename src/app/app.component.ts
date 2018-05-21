import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User = new User();
  isLoggedIn: boolean;
  userName: string;
  token: string;

  constructor(private router: Router,
    private http: Http,
    private data: DataService,
    private auth: AuthService) { }


  ngOnInit() {
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.data.currentUserName.subscribe(userName => this.userName = userName);
  }

  onLogout(): void {
    const token = localStorage.getItem('token');

    this.auth.logout(this.user, token)
      .then((user) => {
        console.log(user.json());
        this.changeStatus();
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        this.router.navigateByUrl('/login');
      })
      .catch((err) => {
        console.log(err.json());
        this.changeStatus();
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        this.router.navigateByUrl('/login');
      });
  }

  changeStatus() {
    this.data.changeStatus(false);
  }
}
