import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { User } from '../../models/user';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  backgroundColor: string;
  headlineColor: string;
  warningColor: string;
  successColor: string;
  navbarColor: string;
  teaserColor: string;
  buttonColor: string;
  errorColor: string;
  alertColor: string;
  infoColor: string;
  linkColor: string;
  textColor: string;

  errorName: string;
  errorEmail: string;
  errorPassword: string;
  rForm: FormGroup;
  hover: boolean;
  post: any;

  user: User = new User();
  isLoggedIn: boolean;
  users: String[];
  error: any = {};

  constructor(private fb: FormBuilder,
    private router: Router,
    private layout: LayoutService,
    private data: DataService,
    private auth: AuthService) {
    this.data.changeIsPublicPage(true);

    this.layout.currentBackgroundColor.subscribe(backgroundColor => this.backgroundColor = backgroundColor);
    this.layout.currentHeadlineColor.subscribe(headlineColor => this.headlineColor = headlineColor);
    this.layout.currentWarningColor.subscribe(warningColor => this.warningColor = warningColor);
    this.layout.currentSuccessColor.subscribe(successColor => this.successColor = successColor);
    this.layout.currentNavbarColor.subscribe(navbarColor => this.navbarColor = navbarColor);
    this.layout.currentTeaserColor.subscribe(teaserColor => this.teaserColor = teaserColor);
    this.layout.currentButtonColor.subscribe(buttonColor => this.buttonColor = buttonColor);
    this.layout.currentAlertColor.subscribe(alertColor => this.alertColor = alertColor);
    this.layout.currentErrorColor.subscribe(errorColor => this.errorColor = errorColor);
    this.layout.currentTextColor.subscribe(textColor => this.textColor = textColor);
    this.layout.currentInfoColor.subscribe(infoColor => this.infoColor = infoColor);
    this.layout.currentLinkColor.subscribe(linkColor => this.linkColor = linkColor);

    this.errorName = 'What\'s your name?';
    this.errorEmail = 'You\'ll use this when you log in and if you ever need to reset your password.';
    this.errorPassword = 'Enter a combination of at least six numbers, letters and punctuation marks.';
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'password': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit() { }

  onRegister(value): void {
    this.auth.register(value)
      .then((user) => {
        // console.log(user.json());
        this.auth.confirmation(value)
          .then(res => {
            // console.log(res.json());
            this.data.changeUserConfirmed(res.json().confirmed);
            this.data.changeUserConfirmedMessage(res.json().message);
            localStorage.setItem('cm', res.json().message);
          })
          .catch(err => {
            console.log(err);
          });

        localStorage.setItem('token', user.json().token);
        this.router.navigateByUrl('/product');
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
