import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  users: String[];
  error: any = {};

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() { }


  onRegister(): void {
    this.auth.register(this.user)
      .then((user) => {
        console.log(user.json());

        if (user.json().status === 'fail') {
          this.error = user.json();
          $('#myModal').modal();
        } else {
          localStorage.setItem('token', user.json().auth_token);
          this.router.navigateByUrl('/status');
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
