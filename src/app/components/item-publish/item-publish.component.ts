import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-item-publish',
  templateUrl: './item-publish.component.html',
  styleUrls: ['./item-publish.component.css']
})
export class ItemPublishComponent implements OnInit {
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

  category: Object = {};
  condition: Object = {};
  currency: Object = {};

  itemName: string;
  categoryId: string;
  currencyId: string;
  description: string;
  shippingFee: string;
  conditionId: string;
  price: string;
  city: string;
  zip: string;

  isLoggedIn: boolean;
  currentUrl: string;
  hover: boolean;
  userId: string;
  token: string;
  url: string;

  constructor(private http: Http,
    private router: Router,
    private layout: LayoutService,
    private data: DataService) {
    this.data.changeIsPublicPage(false);
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

    this.itemName = localStorage.getItem('itemName');
    this.categoryId = localStorage.getItem('categoryId');
    this.currencyId = localStorage.getItem('currencyId');
    this.description = localStorage.getItem('description');
    this.shippingFee = localStorage.getItem('shippingFee');
    this.conditionId = localStorage.getItem('conditionId');
    this.price = localStorage.getItem('price');
    this.city = localStorage.getItem('city');
    this.zip = localStorage.getItem('zip');

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    this.getCategoryById();
    this.getConditionById();
    this.getCurrencyById();
  }

  getCurrencyById() {
    this.http.get(`${this.url}/api/currency/${this.currencyId}`).subscribe(res => {
      // console.log(res.json());
      this.currency = res.json().currency;
    });
  }

  getConditionById() {
    this.http.get(`${this.url}/api/condition/${this.conditionId}`).subscribe(res => {
      // console.log(res.json());
      this.condition = res.json().condition;
    });
  }

  getCategoryById() {
    this.http.get(`${this.url}/api/category/${this.categoryId}`).subscribe(res => {
      console.log(res.json());
      this.category = res.json().category;
    });
  }

  publishProduct() {
    const fd = new FormData;
    let headers: Headers;
    let url: string;

    url = `${this.url}/api/product`;
    headers = new Headers({
      'Authorization': `Bearer ${this.token}`
    });

    fd.append('name', this.itemName);
    fd.append('category_id', this.categoryId);
    fd.append('currency_id', this.currencyId);
    fd.append('description', this.description);
    fd.append('shipping_fee', this.shippingFee);
    fd.append('condition_id', this.conditionId);
    fd.append('price', this.price);
    fd.append('city', this.city);
    fd.append('zip', this.zip);

    return this.http.post(url, fd, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
      })
      .catch(err => {
        console.log(err);
      });
  }
}
