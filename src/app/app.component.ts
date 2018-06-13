import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { LayoutService } from './services/layout.service';
import { environment } from '../environments/environment';
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
  elementScrollHeight: string;
  userConfirmedMessage: string;
  userConfirmed: boolean;
  userId: string;
  isLoggedIn: boolean;
  htmlToAdd: string;
  userName: string;
  token: string;
  url: string;

  constructor(private router: Router,
    public translate: TranslateService,
    private layout: LayoutService,
    private data: DataService,
    private auth: AuthService,
    private http: Http) {
    this.data.currentUserConfirmedMessage.subscribe(userConfirmedMessage => this.userConfirmedMessage = userConfirmedMessage);
    this.data.currentUserConfirmed.subscribe(userConfirmed => this.userConfirmed = userConfirmed);
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.data.currentUserName.subscribe(userName => this.userName = userName);
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

    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'en');

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.checkUserStatus();
    this.data.changeUserConfirmedMessage(localStorage.getItem('cm'));
  }

  setElementHeight(event) {
    const height = document.querySelector('.min-height-100').scrollHeight - 48 + 'px';
    const element = <HTMLElement>document.querySelector('.confirm-restricted');
    element.style.height = height;
  }

  onLogout(): void {
    this.auth.logout(this.user, this.token)
      .then((user) => {
        // console.log(user.json());
        this.data.changeStatus(false);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        localStorage.removeItem('cm');
        this.router.navigateByUrl('/login');
      })
      .catch((err) => {
        // console.log(err.json());
        this.data.changeStatus(false);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        localStorage.removeItem('cm');
        this.router.navigateByUrl('/login');
      });
  }

  checkUserStatus() {
    this.auth.loginStatus(this.token)
      .then((user) => {
        // console.log(user.json());
        this.data.changeStatus(true);
        this.data.changeUserId(user.json().user_id);
        this.data.changeUserName(user.json().name);
        this.data.changeUserConfirmed(user.json().confirmed);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  resendConfirmationLink() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/confirm/user/${this.userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
      })
      .catch(err => {
        console.log(err);
      });
  }
}
