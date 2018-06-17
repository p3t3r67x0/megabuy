import { Component, OnInit, Input } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-inbox-reply',
  templateUrl: './inbox-reply.component.html',
  styleUrls: ['./inbox-reply.component.css']
})
export class InboxReplyComponent implements OnInit {
  @Input() receiver: string;
  @Input() subject: string;
  @Input() parent: string;

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

  requestSubmited: boolean;
  replyForm: FormGroup;
  hover: boolean;
  userId: string;
  token: string;
  url: string;

  errorMessage: string;

  constructor(private http: Http,
    private layout: LayoutService,
    private router: Router,
    private fb: FormBuilder,
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

    this.errorMessage = 'Reply with a minimum of 30 to 15000 characters';
    this.replyForm = fb.group({
      'message': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(15000)])]
    });

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
  }

  submitReplyForm(value) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    console.log(this.receiver);

    value.subject = 'Re: ' + this.subject;
    value.user_id = this.receiver;
    value.parent_id = this.parent;

    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res);
        this.replyForm.reset();
      })
      .catch(err => {
        console.log(err);
      });
  }
}
