import { Component, OnInit, Input } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Order {
  user_id: string;
  product_id: string;
  address_id: string;
}


@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit {
  @Input() productId: string;

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
  userAddressId: string;
  userId: string;
  hover: boolean;
  userToken: string;
  url: string;

  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder,
    private http: Http,
    private router: Router,
    private data: DataService,
    private layout: LayoutService) {
    this.data.changeIsPublicPage(false);
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.data.currentUserToken.subscribe(userToken => this.userToken = userToken);
    this.data.currentUserAddressId.subscribe(userAddressId => this.userAddressId = userAddressId);

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

    this.checkoutForm = fb.group({
      'firstname': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'lastname': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'email': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'country': [7, Validators.compose([Validators.required])],
      'state': [1, Validators.compose([Validators.required])],
      'zipcode': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'street': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'city': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'address': [null],
      'sameAddress': [1],
      'saveAddress': [1],
      'paymentMethod': [null, Validators.compose([Validators.required])]
    });

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.loading = true;
    this.getAddress();
  }

  getAddress() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/address/${this.userAddressId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());
        this.loading = false;
        this.checkoutForm.patchValue({
          'firstname': res.json().address.firstname,
          'lastname': res.json().address.lastname,
          'email': res.json().address.email,
          'street': res.json().address.street,
          'city': res.json().address.city,
          'state': res.json().address.state,
          'zipcode': res.json().address.zipcode,
          'address': res.json().address.street,
          'country': res.json().address.country
        });
      })
      .catch(err => {
        console.log(err.json());
      });
  }

  createOrder(addressId, userId, productId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/order`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    const value: Order = {
      user_id: userId,
      product_id: productId,
      address_id: addressId
    };

    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
        this.router.navigateByUrl('/order/' + res.json().id);
      })
      .catch(err => {
        console.log(err);
      });
  }

  submitCheckoutForm(value) {
    let url: string;
    let headers: Headers;

    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    if (!this.userAddressId) {
      url = `${this.url}/api/address`;

      return this.http.post(url, value, { headers: headers })
        .toPromise()
        .then(res => {
          console.log(res.json());
          this.createOrder(res.json().id, this.userId, this.productId);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      url = `${this.url}/api/address/${this.userAddressId}`;

      return this.http.put(url, value, { headers: headers })
        .toPromise()
        .then(res => {
          console.log(res.json());
          this.createOrder(this.userAddressId, this.userId, this.productId);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
