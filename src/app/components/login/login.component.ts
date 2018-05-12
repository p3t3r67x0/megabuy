import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  isLoggedIn: boolean;
  error: any = {};
  token: string;

  constructor(private router: Router, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  onLogin(): void {
    this.auth.login(this.user)
      .then((user) => {
        this.isLoggedIn = true;
        this.auth.isLoggedIn = this.isLoggedIn;
        localStorage.setItem('token', user.json().token);
        this.router.navigateByUrl('/users');
      })
      .catch((err) => {
        this.error = err.json();

        if ('target' in this.error) {
          this.error = {};
          this.error.message = 'Could not connect to backend.';
          this.error.status = 'error';
        }

        console.log(this.error);
        $('#myModal').modal();
      });
  }
}
