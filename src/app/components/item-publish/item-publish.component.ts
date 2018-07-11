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

  category: any = {};
  condition: any = {};
  currency: any = {};

  itemName: string;
  categoryId: string;
  currencyId: string;
  description: string;
  shippingFee: string;
  conditionId: string;
  tmpImgId: string;
  price: string;
  city: string;
  zip: string;

  tmpThumbnailPath: string;
  tmpImgPath: string[];
  isLoggedIn: boolean;
  currentUrl: string;
  userName: string;
  hover: boolean;
  userId: string;
  userToken: string;
  url: string;

  constructor(private http: Http,
    private router: Router,
    private layout: LayoutService,
    private data: DataService) {
    this.data.changeIsPublicPage(false);
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.data.currentUserName.subscribe(userName => this.userName = userName);
    this.data.currentUserToken.subscribe(userToken => this.userToken = userToken);
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
    this.tmpImgId = localStorage.getItem('tmpImgId');
    this.price = localStorage.getItem('price');
    this.city = localStorage.getItem('city');
    this.zip = localStorage.getItem('zip');

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    if (!this.tmpImgId) {
      this.router.navigateByUrl('/item-category');
    }

    this.getTempImagesById();
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
      // console.log(res.json());
      this.category = res.json().category;
    });
  }

  getTempImagesById() {
    const tmpImgId = this.tmpImgId.split(',');
    const tmpImgPath = [];

    for (const imgId of tmpImgId) {
      this.http.get(`${this.url}/api/tmp/image/${imgId}`).subscribe(res => {
        tmpImgPath.push(res.json().image.image);
      });
    }

    this.tmpImgPath = tmpImgPath;
  }

  publishProduct() {
    let headers: Headers;
    let url: string;

    url = `${this.url}/api/product`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    const post = {
      'name': this.itemName,
      'category_id': this.categoryId,
      'currency_id': this.currencyId,
      'description': this.description,
      'shipping_fee': this.shippingFee,
      'condition_id': this.conditionId,
      'image': this.tmpImgId,
      'price': this.price,
      'city': this.city,
      'zip': this.zip
    };

    return this.http.post(url, post, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());

        localStorage.removeItem('itemName');
        localStorage.removeItem('categoryId');
        localStorage.removeItem('currencyId');
        localStorage.removeItem('description');
        localStorage.removeItem('shippingFee');
        localStorage.removeItem('conditionId');
        localStorage.removeItem('tmpImgId');
        localStorage.removeItem('price');
        localStorage.removeItem('city');
        localStorage.removeItem('zip');

        this.router.navigateByUrl('/product');
      })
      .catch(err => {
        console.log(err);

        if (err.json().status === 'not authorized') {
          return this.router.navigateByUrl('/login?redirect=' + this.currentUrl);
        }
      });
  }
}
