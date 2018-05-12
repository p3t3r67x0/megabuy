import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
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

  constructor(private router: Router, private data: DataService, private auth: AuthService) {
  }

  ngOnInit() {
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  changeStatus() {
    this.data.changeStatus(true);
  }

  onLogin(): void {
    this.auth.login(this.user)
      .then((user) => {
        this.changeStatus();
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
