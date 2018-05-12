import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
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
    if (this.token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  constructor(private router: Router, private auth: AuthService) {
    this.token = localStorage.getItem('token');
  }

  onLogout(): void {
    const token = localStorage.getItem('token');

    this.auth.logout(this.user, token)
      .then((user) => {
        console.log(user.json());
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      })
      .catch((err) => {
        console.log(err.json());
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      });
  }
}
