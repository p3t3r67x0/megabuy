import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  token: string;

  ngOnInit() {
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  constructor(private router: Router, private data: DataService, private auth: AuthService) { }

  onLogout(): void {
    const token = localStorage.getItem('token');

    this.auth.logout(this.user, token)
      .then((user) => {
        console.log(user.json());
        this.changeStatus();
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      })
      .catch((err) => {
        console.log(err.json());
        this.changeStatus();
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      });
  }

  changeStatus() {
    this.data.changeStatus(false);
  }
}
