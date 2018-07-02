import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-radius-search',
  templateUrl: './radius-search.component.html',
  styleUrls: ['./radius-search.component.css']
})
export class RadiusSearchComponent implements OnInit {
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
  userId: string;
  hover: boolean;
  searchForm: FormGroup;
  productCategories: string[];

  constructor(private http: Http,
    private layout: LayoutService,
    private fb: FormBuilder,
    private data: DataService) {
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

    this.searchForm = fb.group({
      'search': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'city_or_zip': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'category': ['', Validators.compose([Validators.required])],
      'distance': [4, Validators.compose([Validators.required])]
    });

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.getProductCategories();
  }

  submitSearchForm(value) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/radius`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
      })
      .catch(err => {
        console.log(err.json());
      });
  }


  getProductCategories() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product-categories`;
    headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((productCategories) => {
        // console.log(productCategories.json());
        this.productCategories = productCategories.json()['product-categories'];
      })
      .catch((err) => {
        console.log(err.json());
        // this.error = err.json();
      });
  }

}
