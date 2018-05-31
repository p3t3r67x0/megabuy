import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  rForm: FormGroup;
  selectedAll: any;
  markAllCheckbox: boolean;
  messages: any[];
  userId: string;
  token: string;
  url: string;

  constructor(private fb: FormBuilder, private http: Http, private data: DataService, private auth: AuthService) {
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.messages = [];
  }

  ngOnInit() {
    this.checkUserStatus();
    this.data.currentUserId.subscribe(userId => this.userId = userId);
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
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].selected) {
        console.log(this.messages[i].id);
      }
    }
  }

  checkUserStatus() {
    this.auth.loginStatus(this.token)
      .then((user) => {
        // console.log(user.json());
        this.changeStatus(true);
        this.changeUserId(user.json().user_id);
        this.changeUserName(user.json().name);
        this.getAllMessagesById();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAllMessagesById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/inbox/user/${this.userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());
        this.messages = res.json().messages;
        for (const m of this.messages) {
          m.selected = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  changeUserId(userId) {
    this.data.changeUserId(userId);
  }

  changeUserName(userName) {
    this.data.changeUserName(userName);
  }

  changeStatus(value) {
    this.data.changeStatus(value);
  }
}
