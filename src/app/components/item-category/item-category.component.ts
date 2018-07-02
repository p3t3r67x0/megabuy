import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.css']
})
export class ItemCategoryComponent implements OnInit {
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

  hover: boolean;
  showSubCategories: boolean;
  subCategories: string[];
  categories: string[];
  categoryId: string;
  userId: string;
  url: string;

  constructor(private http: Http,
    private router: Router,
    private layout: LayoutService,
    private data: DataService) {
    this.data.changeIsPublicPage(true);
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

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.showSubCategories = false;
    this.getAllCategories();
  }

  submitCategoryForm() {
    this.router.navigateByUrl('/item-create/' + this.categoryId);
  }

  addClassActive(categoryId, parentElementId) {
    const activeElements: any = document.getElementById(parentElementId).getElementsByClassName('active');

    for (const element of activeElements) {
      element.classList.remove('active');
    }

    document.getElementById('item-' + categoryId).classList.add('active');

    if (parentElementId === 'secondChoise') {
      this.categoryId = categoryId;
    } else {
      this.categoryId = '';
    }
  }

  querySubCategory(parentId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/categories/${parentId}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((res) => {
        // console.log(res.json()['categories']);
        this.showSubCategories = true;
        this.subCategories = res.json()['categories'];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAllCategories() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product-categories`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((res) => {
        // console.log(res.json()['product-categories']);
        this.categories = res.json()['product-categories'];
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
