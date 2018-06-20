import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit {
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

  userAddressId: string;
  userId: string;
  hover: boolean;
  token: string;
  url: string;

  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder,
    private http: Http,
    private data: DataService,
    private layout: LayoutService) {
    this.data.changeIsPublicPage(false);
    this.data.currentUserId.subscribe(userId => this.userId = userId);
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

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.getAddress();
  }

  getAddress() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/address/${this.userAddressId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
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

  createAddress(value) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/address`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    console.log(value);

    /*
    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    */
  }

  submitCheckoutForm(value) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/checkout`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    console.log(value);

    /*
    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    */
  }
}
