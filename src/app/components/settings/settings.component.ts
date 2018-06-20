import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../../services/layout.service';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
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

  userForm: FormGroup;
  pattern: string;
  hover: boolean;
  token: string;
  userId: string;
  error: any = {};
  url: string;

  errorName: string;
  errorPhone: string;
  errorWebsite: string;
  errorUsername: string;
  errorEmail: string;

  name: string;
  fullName: string;
  userName: string;

  constructor(private fb: FormBuilder,
    private router: Router,
    private layout: LayoutService,
    private http: Http,
    private data: DataService) {
    this.data.changeIsPublicPage(false);
    this.data.currentUserId.subscribe(userId => this.userId = userId);

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
    this.errorPhone = 'What\'s your phone number?';
    this.errorWebsite = 'Do you own a website or an other online account?';
    this.errorUsername = 'Choose an uniqe username';
    this.errorEmail = 'You\'ll use this when you log in and if you ever need to reset your password.';
    this.pattern = '^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}';
    this.userForm = fb.group({
      'name': [this.fullName],
      'firstname': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'lastname': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'phone': [null, Validators.compose([Validators.pattern('[0-9]+')])],
      'username': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'website': [null, Validators.compose([Validators.pattern(this.pattern)])],
      'bio': [null, Validators.compose([Validators.minLength(30), Validators.maxLength(500)])]
    });

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.getUser();
    this.layout.getLayout(this.userId);
  }

  submitUserForm(user) {
    this.updateUser(user, this.token, this.userId)
      .then((res) => {
        // console.log(res.json());
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();

        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
        }

        $('#myModal').modal();
      });
  }

  updateUser(user, token, userId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/user/${userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, user, { headers: headers }).toPromise();
  }

  getFullName(firstName, lastName, name) {
    if (firstName && lastName) {
      return firstName + ' ' + lastName;
    } else {
      return name;
    }
  }

  getUser() {
    this.loadUser(this.token, this.userId)
      .then((user) => {
        // console.log(user.json());
        this.userForm.patchValue({
          'firstname': user.json().user.firstname,
          'lastname': user.json().user.lastname,
          'email': user.json().user.email,
          'phone': user.json().user.phone,
          'username': user.json().user.username,
          'website': user.json().user.website,
          'name': user.json().user.name
        });

        this.fullName = this.getFullName(user.json().user.firstname, user.json().user.lastname, user.json().user.name);

        this.name = this.fullName;
        this.userName = user.json().user.username;

        this.userForm.get('firstname').valueChanges.subscribe(val => {
          this.fullName = this.getFullName(val, this.userForm.get('lastname').value, user.json().user.name);
          this.data.changeUserName('VORNAME');
          this.name = this.fullName;
        });

        this.userForm.get('lastname').valueChanges.subscribe(val => {
          this.fullName = this.getFullName(this.userForm.get('firstname').value, val, user.json().user.name);
          this.data.changeUserName('NACHNAME');
          this.name = this.fullName;
        });

        this.userForm.get('username').valueChanges.subscribe(val => {
          this.userName = val;
        });
      })
      .catch((err) => {
        console.log(err);
        this.error = err.json();

        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
        }
      });
  }

  loadUser(token, userId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/user/${userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }
}
