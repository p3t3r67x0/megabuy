import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SplitPipe } from 'angular-pipes';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
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
  rForm: FormGroup;
  url: string;
  errorName: string;
  errorSubject: string;
  errorMessage: string;
  requestSubmited: boolean;
  imageLength: number;
  productId: string;
  userId: string;
  userName: string;
  token: string;
  product: any = {};
  error: any = {};

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: Http,
    private layout: LayoutService,
    private element: ElementRef,
    private data: DataService,
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

    this.errorName = 'What\'s your name?';
    this.errorSubject = 'Tell the seller where they can contact you';
    this.errorMessage = 'You may want to descripe your question more detailed';
    this.rForm = fb.group({
      'name': [this.userName, Validators.compose([Validators.required, Validators.minLength(2)])],
      'subject': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'message': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])]
    });
  }

  ngOnInit() {
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.checkUserStatus();
    this.getProductById();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submitContactForm(value) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/inbox`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    value.user_id = this.product.user_id;
    value.parent_id = '';

    return this.http.post(url, value, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res);
        this.requestSubmited = true;
        this.rForm.reset();
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkUserStatus() {
    this.auth.loginStatus(localStorage.getItem('token'))
      .then((user) => {
        // console.log(user.json());
        this.changeStatus();
        this.changeUserId(user.json().user_id);
        this.changeUserName(user.json().name);
        this.userName = user.json().name;
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  getProductById() {
    this.getOneProductById()
      .then((product) => {
        // console.log(product.json());
        this.product = product.json();
        this.imageLength = this.product.image.split(',').length;
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();
      });
  }

  imageClicked(event) {
    const el = this.element.nativeElement.querySelector('div.col-xs-12.margin-bottom-12');
    const src = event.target;
    el.innerHTML = src.outerHTML;
  }

  getOneProductById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product/${this.productId}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }

  changeUserId(userId) {
    this.data.changeUserId(userId);
  }

  changeUserName(userName) {
    this.data.changeUserName(userName);
  }

  changeStatus() {
    this.data.changeStatus(true);
  }

}
