import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
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
  userToken: string;
  products: any = [];
  loading: boolean;

  constructor(private http: Http,
    private router: Router,
    private data: DataService,
    private layout: LayoutService) {
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

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.loading = true;
    this.getWishlist();
  }

  getWishlist() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/wishlist`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json().wishlist);
        this.loading = false;
        this.products = res.json().wishlist;
      })
      .catch(err => {
        console.log(err.json());
      });
  }

  removeFromWishlist(productId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/wishlist/${productId}`;

    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    return this.http.delete(url, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());
        const wishlistElement = document.getElementById('item-' + productId);
        wishlistElement.parentNode.removeChild(wishlistElement);
      })
      .catch((err) => {
        console.log(err.json());
      });
  }
}
