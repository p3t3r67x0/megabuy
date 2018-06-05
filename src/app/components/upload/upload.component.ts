import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  url: string;
  error: string;
  token: string;
  currencies: string[];
  selectedFile: any = [];
  rForm: FormGroup;
  productCategories: string[];

  @Output() uploaded = new EventEmitter<string>();

  constructor(private http: Http, private fb: FormBuilder, private router: Router) {
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.getAllProductCategories();
    this.getAllCurrencies();
    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      'category': ['a4acbd3b4d36', Validators.required],
      'thumbnail': [null, Validators.required],
      'currency': ['b20c5d668a7f', Validators.required],
      'price': [null, Validators.required]
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

  onUpload(value) {
    let url: string;
    let file: any = '';
    let headers: Headers;
    const fd = new FormData;

    fd.append('name', value.name);
    fd.append('description', value.description);
    fd.append('category_id', value.category);
    fd.append('currency_id', value.currency);
    fd.append('price', value.price);

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
        this.rForm.reset();
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
