import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() redirect: string;

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

  errorEmail: string;
  errorPassword: string;
  modalId = 'login-error';
  rForm: FormGroup;
  hover: boolean;
  post: any;

  userId: string;
  userName: string;
  fullName: string;
  userConfirmed: boolean;
  redirectUrl: string;
  isAdmin: string;
  error: any = {};
  token: string;
  url: string;
  sub: any;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private layout: LayoutService,
    private data: DataService,
    private auth: AuthService) {
    this.data.changeIsPublicPage(true);
    this.data.currentUserConfirmed.subscribe(userConfirmed => this.userConfirmed = userConfirmed);
    this.data.currentAdminStatus.subscribe(isAdmin => this.isAdmin = isAdmin);
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

    this.errorEmail = 'The email address that you\'ve entered doesn\'t match any account.';
    this.errorPassword = 'Enter a combination of at least six numbers, letters and punctuation marks.';
    this.rForm = fb.group({
      'password': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
    });

    this.sub = this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirect'];
    });

    this.url = environment.apiUrl;
  }

  ngOnInit() { }

  onLogin(value): void {
    this.auth.login(value)
      .then((user) => {
        console.log(user.json());

        if (user.json().user.admin) {
          this.data.changeAdminStatus(true);
          localStorage.setItem('admin', user.json().user.admin);
        }

        // if user not confirmed
        if (!user.json().user.confirmed) {
          const confirmationMessage = 'Confirm your email address';
          this.data.changeUserConfirmedMessage(confirmationMessage);
          localStorage.setItem('cm', confirmationMessage);
        }

        // get full name from user
        if (user.json().user.firstname && user.json().user.lastname) {
          this.fullName = user.json().user.firstname + ' ' + user.json().user.lastname;
        } else {
          this.fullName = user.json().user.name;
        }

        localStorage.setItem('token', user.json().token);

        this.data.changeUserConfirmed(user.json().user.confirmed);
        this.data.changeUserAvatar(this.url + '/' + user.json().user.avatar);
        this.data.changeUserAddressId(user.json().user.address_id);
        this.data.changeUserId(user.json().user.public_id);
        this.data.changeUserName(this.fullName);
        this.data.changeUserStatus(true);

        if (this.redirectUrl) {
          this.router.navigateByUrl(decodeURI(this.redirectUrl));
        } else {
          this.router.navigateByUrl(this.redirect);
        }
      })
      .catch((err) => {
        this.error = err.json();

        if ('target' in this.error) {
          this.error = {};
          this.error.message = 'Could not connect to backend.';
          this.error.status = 'error';
        }

        console.log(err.json());
        $('#' + this.modalId).modal();
      });
  }
}
