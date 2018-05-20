import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  errorName: string;
  errorEmail: string;
  errorPassword: string;
  rForm: FormGroup;
  post: any;

  user: User = new User();
  isLoggedIn: boolean;
  users: String[];
  error: any = {};

  constructor(private fb: FormBuilder, private router: Router, private data: DataService, private auth: AuthService) {
    this.errorName = 'What\'s your name?';
    this.errorEmail = 'You\'ll use this when you log in and if you ever need to reset your password.';
    this.errorPassword = 'Enter a combination of at least six numbers, letters and punctuation marks.';
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'password': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit() { }

  onRegister(value): void {
    this.auth.register(value)
      .then((user) => {
        // console.log(user.json());
        localStorage.setItem('token', user.json().token);
        this.router.navigateByUrl('/products');
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
