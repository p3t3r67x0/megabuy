import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
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

  itemName: string;
  categoryId: string;
  currencyId: string;
  description: string;
  shippingFee: string;
  conditionId: string;
  price: string;
  city: string;
  zip: string;

  url: string;
  token: string;
  hover: boolean;
  currencies: string[];
  childCategory: Object = {};
  parentCategory: Object = {};
  categoryChildId: string;
  productConditions: string[];
  productCategories: string[];
  uploadForm: FormGroup;
  selectedFile: any = [];
  error: any = {};
  sub: any;

  constructor(private http: Http,
    private route: ActivatedRoute,
    private layout: LayoutService,
    private fb: FormBuilder,
    private router: Router) {
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

    if (!this.categoryId) {
      this.categoryId = 'a4acbd3b4d36';
    }

    if (!this.currencyId) {
      this.currencyId = 'b20c5d668a7f';
    }

    if (!this.conditionId) {
      this.conditionId = '251e384c9c43';
    }

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;

    this.itemName = localStorage.getItem('itemName');
    this.categoryId = localStorage.getItem('categoryId');
    this.currencyId = localStorage.getItem('currencyId');
    this.description = localStorage.getItem('description');
    this.shippingFee = localStorage.getItem('shippingFee');
    this.conditionId = localStorage.getItem('conditionId');
    this.price = localStorage.getItem('price');
    this.city = localStorage.getItem('city');
    this.zip = localStorage.getItem('zip');

    this.sub = this.route.params.subscribe(params => {
      this.categoryChildId = params['id'];
    });

    this.uploadForm = fb.group({
      'name': [this.itemName, Validators.required],
      'description': [this.description, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(5000)])],
      'category': [this.categoryChildId, Validators.required],
      'thumbnail': [null, Validators.required],
      'condition_id': [this.conditionId, Validators.required],
      'shipping_fee': [this.shippingFee, Validators.required],
      'currency': [this.currencyId, Validators.required],
      'price': [this.price, Validators.required],
      'city': [this.city, Validators.required],
      'zip': [this.zip, Validators.required]
    });

    this.getAllProductCategories();
    this.getAllCurrencies();
    this.getAllConditions();
    this.getCategoryById();
  }

  ngOnInit() { }

  onFileSelected(event) {
    this.selectedFile = [];
    let file = '';

    for (file of event.target.files) {
      this.selectedFile.push(file);
    }
  }

  getParentCategoryById(parentId) {
    this.http.get(`${this.url}/api/category/${parentId}`).subscribe(res => {
      // console.log(res.json());
      this.parentCategory = res.json().category;
    });
  }

  getCategoryById() {
    this.http.get(`${this.url}/api/category/${this.categoryChildId}`).subscribe(res => {
      // console.log(res.json());
      this.childCategory = res.json().category;
      this.getParentCategoryById(res.json().category.parent_id);
    });
  }

  getAllCurrencies() {
    this.http.get(`${this.url}/api/currencies`).subscribe(res => {
      // console.log(res.json());
      this.currencies = res.json().currencies;
    });
  }

  getAllConditions() {
    this.http.get(`${this.url}/api/conditions`).subscribe(res => {
      // console.log(res.json());
      this.productConditions = res.json().conditions;
    });
  }

  onUpload(value) {
    let file: any = '';
    const fd = new FormData;

    fd.append('itemName', value.name);
    fd.append('categoryId', value.category);
    fd.append('currencyId', value.currency);
    fd.append('description', value.description);
    fd.append('shippingFee', value.shipping_fee);
    fd.append('conditionId', value.condition_id);
    fd.append('price', value.price);
    fd.append('city', value.city);
    fd.append('zip', value.zip);

    localStorage.setItem('itemName', value.name);
    localStorage.setItem('categoryId', value.category);
    localStorage.setItem('currencyId', value.currency);
    localStorage.setItem('description', value.description);
    localStorage.setItem('shippingFee', value.shipping_fee);
    localStorage.setItem('conditionId', value.condition_id);
    localStorage.setItem('price', value.price);
    localStorage.setItem('city', value.city);
    localStorage.setItem('zip', value.zip);

    for (file of this.selectedFile) {
      fd.append('image', file, file.name);
      localStorage.setItem('image', file);
    }

    this.router.navigateByUrl('/item-publish');

  }

  getAllProductCategories() {
    this.loadAllProductCategories(this.token, -1, 1)
      .then((productCategories) => {
        // console.log(productCategories.json());
        this.productCategories = productCategories.json()['product-categories'];
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();

        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
        }
      });
  }

  loadAllProductCategories(token, limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.url}/api/product-categories`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
  }
}
