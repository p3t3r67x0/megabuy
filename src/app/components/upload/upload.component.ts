import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
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
  token: string;
  hover: boolean;
  currencies: string[];
  productConditions: string[];
  productCategories: string[];
  uploadForm: FormGroup;
  selectedFile: any = [];
  error: any = {};

  @Output() uploaded = new EventEmitter<string>();

  constructor(private http: Http,
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

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;

    this.getAllProductCategories();
    this.getAllCurrencies();
    this.getAllConditions();

    this.uploadForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      'category': ['a4acbd3b4d36', Validators.required],
      'thumbnail': [null, Validators.required],
      'condition_id': ['251e384c9c43', Validators.required],
      'currency': ['b20c5d668a7f', Validators.required],
      'shipping_fee': [null, Validators.required],
      'price': [null, Validators.required],
      'city': [null, Validators.required],
      'zip': [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.selectedFile = [];
    let file = '';

    for (file of event.target.files) {
      this.selectedFile.push(file);
    }
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
    let url: string;
    let file: any = '';
    let headers: Headers;
    const fd = new FormData;

    fd.append('name', value.name);
    fd.append('category_id', value.category);
    fd.append('currency_id', value.currency);
    fd.append('description', value.description);
    fd.append('shipping_fee', value.shipping_fee);
    fd.append('condition_id', value.condition_id);
    fd.append('price', value.price);
    fd.append('city', value.city);
    fd.append('zip', value.zip);

    for (file of this.selectedFile) {
      fd.append('image', file, file.name);
    }

    url = `${this.url}/api/product`;
    headers = new Headers({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(url, fd, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());
        this.uploadForm.reset();
        this.uploaded.emit();
      })
      .catch(err => {
        console.log(err);
      });
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
