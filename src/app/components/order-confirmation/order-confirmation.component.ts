import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
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

  loading: boolean;
  currentUrl: string;
  userToken: string;
  orderId: string;
  userId: string;
  hover: boolean;
  url: string;
  order: any = {};
  sub: any;

  constructor(private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private layout: LayoutService,
    private data: DataService) {
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

    this.sub = this.route.params.subscribe(params => {
      this.orderId = params['id'];
    });

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.loading = true;
    this.getOrder();
  }

  getOrder() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/order/${this.orderId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());
        this.loading = false;
        this.order = res.json().order;
      })
      .catch(err => {
        console.log(err.json());

        if (err.json().status === 'not found') {
          return this.router.navigateByUrl('/orders');
        }
      });
  }

  OnBuyNow(orderId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/order/status/${orderId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    return this.http.put(url, {}, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
        return this.router.navigateByUrl('/orders');
      })
      .catch(err => {
        console.log(err);

        if (err.json().status === 'not authorized') {
          this.data.changeUserStatus(false);
          this.data.changeUserName('');
          this.data.changeUserToken('');
          localStorage.removeItem('token');
          return this.router.navigateByUrl('/login?redirect=' + this.currentUrl);
        }
      });
  }

}
