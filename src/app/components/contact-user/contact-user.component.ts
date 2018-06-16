import { Component, OnInit, Input } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-contact-user',
  templateUrl: './contact-user.component.html',
  styleUrls: ['./contact-user.component.css']
})
export class ContactUserComponent implements OnInit {
  @Input() product: any;

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

  showLoginForm: boolean;
  requestSubmited: boolean;
  contactForm: FormGroup;
  isLoggedIn: boolean;
  currentUrl: string;
  userName: string;
  userId: string;
  token: string;
  url: string;

  errorPhone: string;
  errorSubject: string;
  errorMessage: string;

  constructor(private fb: FormBuilder,
    private http: Http,
    private router: Router,
    private layout: LayoutService,
    private data: DataService) {
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.data.currentUserStatus.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);

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

    this.errorPhone = 'Tell the seller how to get touch with you';
    this.errorSubject = 'Describe in short what you want to ask';
    this.errorMessage = 'You may want to descripe your question more detailed';
    this.contactForm = fb.group({
      'telephone': [this.userName, Validators.compose([Validators.required, Validators.minLength(2)])],
      'subject': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'message': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])]
    });

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
  }

  signInForMessage() {
    this.showLoginForm = true;
  }

  submitContactForm(value) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    value.user_id = this.product.user_id;
    value.parent_id = '';

    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res);
        this.requestSubmited = true;
        this.contactForm.reset();
      })
      .catch(err => {
        console.log(err);
      });
  }

}
