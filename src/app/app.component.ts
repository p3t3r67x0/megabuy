import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { LayoutService } from './services/layout.service';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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

  user: User = new User();
  isLoggedIn: boolean;
  userName: string;
  token: string;

  constructor(private router: Router,
    private layout: LayoutService,
    private data: DataService,
    private auth: AuthService,
    private http: Http) {
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.data.currentUserName.subscribe(userName => this.userName = userName);

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
  }

  ngOnInit() { }

  onLogout(): void {
    const token = localStorage.getItem('token');

    this.auth.logout(this.user, token)
      .then((user) => {
        console.log(user.json());
        this.changeStatus();
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        this.router.navigateByUrl('/login');
      })
      .catch((err) => {
        console.log(err.json());
        this.changeStatus();
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        this.router.navigateByUrl('/login');
      });
  }

  changeStatus() {
    this.data.changeStatus(false);
  }
}
