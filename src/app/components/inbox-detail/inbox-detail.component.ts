import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-inbox-detail',
  templateUrl: './inbox-detail.component.html',
  styleUrls: ['./inbox-detail.component.css']
})
export class InboxDetailComponent implements OnInit {
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

  messageId: string;
  showReplyForm: boolean;
  modalId = 'inbox-detail-error';
  messages: any = [];
  message: any = {};
  error: any = {};
  userId: string;
  userToken: string;
  url: string;
  sub: any;

  constructor(private route: ActivatedRoute,
    private http: Http,
    private layout: LayoutService,
    private router: Router,
    private data: DataService,
    private auth: AuthService) {
    this.data.changeIsPublicPage(false);
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.data.currentUserToken.subscribe(userToken => this.userToken = userToken);

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

    this.url = environment.apiUrl;

    this.sub = this.route.params.subscribe(params => {
      this.messageId = params['id'];
    });
  }

  ngOnInit() {
    this.getMessageById();
  }

  openReplyForm() {
    this.showReplyForm = true;
  }

  deleteMessageById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox/user/${this.userId}/${this.messageId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    return this.http.delete(url, { headers: headers })
      .toPromise()
      .then((message) => {
        // console.log(message.json());
        this.router.navigateByUrl('/inbox');
      })
      .catch((err) => {
        // console.log(err.json());
        this.error = err.json();
        $('#' + this.modalId).modal();
      });
  }

  updateMessageStatusById() {
    let url: string;
    let read: boolean;
    let headers: Headers;

    read = true;
    url = `${this.url}/api/inbox/user/${this.userId}/${this.messageId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    return this.http.put(url, read, { headers: headers })
      .toPromise()
      .then((message) => {
        // console.log(message.json());
      })
      .catch((err) => {
        // console.log(err.json());
        this.error = err.json();
        $('#' + this.modalId).modal();
      });
  }

  getParentMessageById(userId, parentId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox/user/${userId}/${parentId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((message) => {
        console.log(message.json());
        this.messages.push(message.json());

        if (message.json().parent_id) {
          this.getParentMessageById(message.json().user_id, message.json().parent_id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getMessageById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox/user/${this.userId}/${this.messageId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((message) => {
        console.log(message.json());
        // this.message = message.json();
        this.messages.push(message.json());

        if (message.json().parent_id) {
          this.getParentMessageById(message.json().user_id, message.json().parent_id);
        }

        if (!this.message.read) {
          this.updateMessageStatusById();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
