import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
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

  rForm: FormGroup;
  selectedAll: any;
  markAllCheckbox: boolean;
  modalId = 'inbox-error';
  error: any = {};
  messages: any[];
  userId: string;
  token: string;
  url: string;

  constructor(private fb: FormBuilder,
    private http: Http,
    private layout: LayoutService,
    private data: DataService,
    private auth: AuthService) {
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
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.messages = [];
  }

  ngOnInit() {
    this.checkUserStatus();
  }

  reloadInbox() {
    this.getAllMessagesById();
  }

  isAllChecked() {
    return this.messages.every(_ => _.selected);
  }

  checkAll(ev) {
    this.messages.forEach(x => x.selected = ev.target.checked);
  }

  deleteMessages() {
    let url: string;
    let headers: Headers;

    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].selected) {
        url = `${this.url}/api/inbox/user/${this.userId}/${this.messages[i].id}`;

        this.http.delete(url, { headers: headers })
          .toPromise()
          .then((message) => {
            for (let j = 0; j < this.messages.length; j++) {
              if (this.messages[j].id === this.messages[i].id) {
                // console.log(message.json());
                this.messages.splice(i, 1);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  updateAllMessageStatusById() {
    let url: string;
    let read: boolean;
    let headers: Headers;

    read = true;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    for (let j = 0; j < this.messages.length; j++) {
      url = `${this.url}/api/inbox/user/${this.userId}/${this.messages[j].id}`;

      this.http.put(url, read, { headers: headers })
        .toPromise()
        .then((message) => {
          // console.log(this.messages[j].id);
          this.messages[j].read = true;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  checkUserStatus() {
    this.auth.loginStatus(this.token)
      .then((user) => {
        // console.log(user.json());
        this.data.changeUserStatus(true);
        this.data.changeUserId(user.json().user_id);
        this.data.changeUserName(user.json().name);
        this.data.changeUserConfirmed(user.json().confirmed);
        this.getAllMessagesById();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAllMessagesById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox/user/${this.userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
        this.messages = res.json().messages;
        for (const m of this.messages) {
          m.selected = false;
        }
      })
      .catch(err => {
        console.log(err.json());
      });
  }
}
