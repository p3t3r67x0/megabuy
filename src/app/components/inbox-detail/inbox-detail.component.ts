import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-inbox-detail',
  templateUrl: './inbox-detail.component.html',
  styleUrls: ['./inbox-detail.component.css']
})
export class InboxDetailComponent implements OnInit {
  messageId: string;
  userId: string;
  message: any = {};
  token: string;
  url: string;
  sub: any;

  constructor(private route: ActivatedRoute,
    private http: Http,
    private data: DataService,
    private auth: AuthService) {
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;

    this.sub = this.route.params.subscribe(params => {
      this.messageId = params['id'];
    });
  }

  ngOnInit() {
    this.checkUserStatus();
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.getMessageById();
  }


  getMessageById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/inbox/user/${this.userId}/${this.messageId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((message) => {
        console.log(message.json());
        this.message = message.json();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkUserStatus() {
    this.auth.loginStatus(this.token)
      .then((user) => {
        // console.log(user.json());
        this.changeStatus(true);
        this.changeUserId(user.json().user_id);
        this.changeUserName(user.json().name);
      })
      .catch((err) => {
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
