import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';
import { LayoutService } from '../../services/layout.service';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
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

  url: string;
  limit: number;
  page: number;
  token: string;
  hover: boolean;
  editField: string;
  error: any = {};
  modalId = 'product-category-error';
  productCategories: any = [];
  rForm: FormGroup;
  userId: string;

  constructor(private http: Http,
    private router: Router,
    private layout: LayoutService,
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

    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    });

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.limit = -1;
    this.page = 1;
    this.getProductCategories();
  }

  showUpdateForm(productCategoryId) {
    if (!this.editField || this.editField !== productCategoryId) {
      this.editField = productCategoryId;
    } else {
      this.editField = '';
    }
  }

  addProductCategory(value) {
    this.postProductCategory(value, this.token)
      .then((user) => {
        // console.log(user.json());

        if (user.json().status === 'success') {
          this.rForm.reset();
          this.getProductCategories();
        }
      })
      .catch((err) => {
        // console.log(err.json());
        this.error = err.json();
        $('#' + this.modalId).modal();
      });
  }

  updateEntry(productCategory) {
    this.updateProductCategory(productCategory, this.token)
      .then((res) => {
        // console.log(res.json());
      })
      .catch((err) => {
        // console.log(err.json());
        this.error = err.json();
        $('#' + this.modalId).modal();
      });
  }

  removeProductCategory(productCategoryId) {
    this.deleteProductCategory(this.token, productCategoryId)
      .then((productCategory) => {
        // console.log(productCategory.json());
        for (let i = 0; i < this.productCategories.length; i++) {
          if (this.productCategories[i]['id'] === productCategoryId) {
            this.productCategories.splice(i, 1);
          }
        }
      })
      .catch((err) => {
        // console.log(err.json());
        this.error = err.json();
        $('#' + this.modalId).modal();
      });
  }

  getProductCategories() {
    this.loadProductCategories(this.token, this.limit, this.page)
      .then((productCategories) => {
        // console.log(productCategories.json());
        this.productCategories = productCategories.json()['product-categories'];
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  loadProductCategories(token, limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.url}/api/product-categories/user`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
  }

  updateProductCategory(productCategory, token) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product-category/${productCategory.id}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, productCategory, { headers: headers }).toPromise();
  }

  deleteProductCategory(token, productCategoryId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product-category/${productCategoryId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(url, { headers: headers }).toPromise();
  }

  postProductCategory(product, token): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product-category`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(url, product, { headers: headers }).toPromise();
  }
}
