import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { SplitPipe } from 'angular-pipes';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-category-tag',
  templateUrl: './product-category-tag.component.html',
  styleUrls: ['./product-category-tag.component.css']
})
export class ProductCategoryTagComponent implements OnInit, OnDestroy {
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

  private sub: any;
  url: string;
  categoryId: string;
  userId: string;
  products: any = [];
  error: any = {};

  constructor(private route: ActivatedRoute,
    private http: Http,
    private data: DataService,
    private layout: LayoutService,
    private auth: AuthService) {
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
  }

  ngOnInit() {
    this.url = environment.apiUrl;
    this.sub = this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getProducts();
    });
    this.checkUserStatus();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkUserStatus() {
    this.auth.loginStatus(localStorage.getItem('token'))
      .then((user) => {
        // console.log(user.json());
        this.data.changeStatus(true);
        this.data.changeUserId(user.json().user_id);
        this.data.changeUserName(user.json().name);
        this.data.changeUserConfirmed(user.json().confirmed);
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  getProducts() {
    this.getAllProducts(this.categoryId)
      .then((products) => {
        // console.log(products.json().products);
        this.products = products.json().products;
        // this.products.image = this.products['thumbnail'].split(',')[0];
      })
      .catch((err) => {
        console.log(err);
        this.error = err.json();
      });
  }

  getAllProducts(categoryId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product/category/${categoryId}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }
}
