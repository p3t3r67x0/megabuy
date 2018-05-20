import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  url: string;
  limit: number;
  page: number;
  token: string;
  editField: string;
  error: any = {};
  productCategories: any = [];
  rForm: FormGroup;
  userId: string;

  constructor(private http: Http, private router: Router, private fb: FormBuilder, private data: DataService) {
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(10)])],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    });
  }

  ngOnInit() {
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.limit = -1;
    this.page = 1;
    this.getProductCategories();
  }

  showUpdateForm(productCategoryId) {
    if (!this.editField || this.editField !== productCategoryId) {
      this.editField = productCategoryId;
    } else {
      this.editField = '';
    }
  }

  addProductCategory(value) {
    this.postProductCategory(value, this.token)
      .then((user) => {
        console.log(user.json());

        if (user.json().status === 'success') {
          this.rForm.reset();
          this.getProductCategories();
        }
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

  updateEntry(productCategory) {
    this.updateProductCategory(productCategory, this.token)
      .then((res) => {
        console.log(res.json());
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

  removeProductCategory(productCategoryId) {
    this.deleteProductCategory(this.token, productCategoryId)
      .then((productCategory) => {
        console.log(productCategory.json());
        for (let i = 0; i < this.productCategories.length; i++) {
          if (this.productCategories[i]['id'] === productCategoryId) {
            this.productCategories.splice(i, 1);
          }
        }
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

  getProductCategories() {
    this.loadProductCategories(this.token, this.limit, this.page)
      .then((productCategories) => {
        console.log(productCategories.json());
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

  loadProductCategories(token, limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.url}/product-categories`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
  }

  updateProductCategory(productCategory, token) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product-category/${productCategory.id}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, productCategory, { headers: headers }).toPromise();
  }

  deleteProductCategory(token, productCategoryId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product-category/${productCategoryId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(url, { headers: headers }).toPromise();
  }

  postProductCategory(product, token): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product-category`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(url, product, { headers: headers }).toPromise();
  }
}
