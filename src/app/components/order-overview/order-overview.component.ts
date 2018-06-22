import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css']
})
export class OrderOverviewComponent implements OnInit {
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

  orders: any = [];
  userId: string;
  token: string;
  url: string;

  constructor(private http: Http,
    private router: Router,
    private layout: LayoutService,
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

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.getAllOrderByUser();
  }

  getAllOrderByUser() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/order/user/${this.userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
        this.orders = res.json().orders;
      })
      .catch(err => {
        console.log(err.json());
      });
  }
}
