import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { SplitPipe } from 'angular-pipes';
import { latLng, tileLayer, icon, marker } from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
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

  loading: boolean;
  sub: any;
  url: string;
  hover: boolean;
  marker: any = {};
  options: any = {};
  userToken: string;
  currentUrl: string;
  imageLength: number;
  isLoggedIn: boolean;
  productId: string;
  userId: string;
  userName: string;
  product: any = {};
  error: any = {};

  constructor(private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private layout: LayoutService,
    private element: ElementRef,
    private data: DataService,
    private auth: AuthService) {
    this.data.changeIsPublicPage(true);
    this.data.currentUserId.subscribe(userId => this.userId = userId);
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

    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];
    });

    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.loading = true;
    this.currentUrl = this.router.url;
    this.getProductById();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onBuyNow() {
    this.router.navigateByUrl('/checkout/' + this.productId);
  }

  imageClicked(event) {
    const el = this.element.nativeElement.querySelector('div.col-xs-12.margin-bottom-12');
    const src = event.target;
    el.innerHTML = src.outerHTML;
  }

  addToWishlist() {
    if (!this.isLoggedIn) {
      return this.router.navigateByUrl('/login?redirect=' + this.currentUrl);
    }

    let url: string;
    let headers: Headers;

    url = `${this.url}/api/wishlist`;

    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userToken}`
    });

    const post = {
      'product_id': this.productId,
      'user_id': this.userId
    };

    return this.http.post(url, post, { headers: headers })
      .toPromise()
      .then(res => {
        console.log(res.json());
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  getProductById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/product/${this.productId}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then((product) => {
        // console.log(product.json());
        this.loading = false;
        this.product = product.json();
        this.imageLength = this.product.image.split(',').length;

        if (product.json().lat && product.json().lng) {
          this.marker = marker([product.json().lat, product.json().lng]);
          this.options = {
            layers: [
              tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', { maxZoom: 18 }), this.marker
            ],
            zoom: 15,
            scrollWheelZoom: false,
            center: latLng(product.json().lat, product.json().lng)
          };
        }
      })
      .catch((err) => {
        console.log(err);
        this.error = err.json();
      });
  }
}
