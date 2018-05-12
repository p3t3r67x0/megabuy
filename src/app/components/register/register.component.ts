import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  isLoggedIn: boolean;
  users: String[];
  error: any = {};

  constructor(private router: Router, private data: DataService, private auth: AuthService) { }

  ngOnInit() {
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  changeStatus() {
    this.data.changeStatus(true);
  }

  onRegister(): void {
    this.auth.register(this.user)
      .then((user) => {
        // console.log(user.json());

        if (user.json().status === 'fail') {
          this.error = user.json();
          $('#myModal').modal();
        } else {
          this.changeStatus();
          localStorage.setItem('token', user.json().token);
          this.router.navigateByUrl('/users');
        }
      })
      .catch((err) => {
        this.error = err.json();

        if ('target' in this.error) {
          this.error = {};
          this.error.message = 'Could not connect to backend.';
          this.error.status = 'fail';
        }

        console.log(this.error);
        $('#myModal').modal();
      });
  }

}
