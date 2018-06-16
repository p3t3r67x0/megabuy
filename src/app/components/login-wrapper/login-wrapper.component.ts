import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrls: ['./login-wrapper.component.css']
})
export class LoginWrapperComponent implements OnInit {
  redirectUrl: string;

  constructor() { }

  ngOnInit() {
    this.redirectUrl = '/settings';
  }

}
