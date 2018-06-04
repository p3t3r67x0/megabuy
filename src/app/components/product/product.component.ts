interface FormData {
  entries(): Iterator<[USVString, USVString | Blob]>;
}

import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { SplitPipe } from 'angular-pipes';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

declare var jquery: any;
declare var $: any;



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  url: string;
  limit: number;
  page: number;
  userId: string;
  headers: Headers;
  product: Product;
  editField: string;
  selectedFile: any = [];
  loading: boolean;
  token: string;
  description: string;
  name: string;
  error: Error;
  errorName: string;
  currencies: string[];
  products: any = [];
  productCategories: string[];


  constructor(private fb: FormBuilder,
    private http: Http,
    private router: Router,
    private data: DataService) {
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.headers = new Headers({
      'content-type': 'application/json'
    });
    this.getAllProductCategories();
  }

  ngOnInit() {
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.limit = -1;
    this.page = 1;
    this.getAllProductsByUser();
    this.getAllCurrencies();
  }

  onFileSelected(event, imageId, productId) {
    let url: string;
    let file: any = '';
    let headers: Headers;
    const fd = new FormData;

    url = `${this.url}/image`;
    headers = new Headers({
      'Authorization': `Bearer ${this.token}`
    });

    fd.append('product_id', productId);

    for (file of event.target.files) {
      if (file) {
        const reader = new FileReader();

        fd.append('thumbnail', file, file.name);
        reader.onload = function(e: any) {
          const image = '<img width="100%" height="auto" src="' + e.target.result + '">';
          const imageWrapper = '<div class="margin-top-12 margin-left-12">' + image + '</div>';
          $('#thumbnail-' + productId).prepend(imageWrapper);
        };

        reader.readAsDataURL(file);

        this.http.put(url, fd, { headers: headers }).toPromise();

        for (const pair of fd.entries()) {
          console.log(pair);
          fd.delete(pair[0]);
        }
      }
    }
    // $('#' + imageId).attr('src', $('#thumbnail-images'));
  }

  showUpdateForm(productId) {
    if (!this.editField || this.editField !== productId) {
      this.editField = productId;
    } else {
      this.editField = '';
    }
  }

  getAllCurrencies() {
    this.http.get(`${this.url}/currencies`).subscribe(res => {
      // console.log(res.json());
      this.currencies = res.json().currencies;
    });
  }

  updateEntry(product) {
    this.updateOneProductById(product, this.token)
      .then((res) => {
        // console.log(res.json());
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

  updateOneProductById(product, token) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/${product.id}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, product, { headers: headers }).toPromise();
  }

  removeProductById(productId) {
    this.deleteProduct(this.token, productId)
      .then((product) => {
        // console.log(product.json());
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i]['id'] === productId) {
            this.products.splice(i, 1);
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

  getAllImagesById(productId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/image/product/${productId}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers }).toPromise();
  }

  getAllProductsByUser() {
    this.loadProducts(this.token)
      .then((products) => {
        this.products = products.json().products;

        for (let i = 0; i < this.products.length; i++) {
          console.log(this.products[i].id);
          this.getAllImagesById(this.products[i].id)
            .then(res => {
              this.products[i].image = res.json().images;
            })
            .catch(err => {
              console.log(err);
            });
        }
        console.log(this.products);
      })
      .catch((err) => {
        console.log(err);

        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
        }
      });
  }

  loadProducts(token) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/user/${this.userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers: headers }).toPromise();
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

    url = `${this.url}/product-categories`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
  }

  deleteProduct(token, productId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/${productId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(url, { headers: headers }).toPromise();
  }

}

interface Product {
  name: string;
  description: string;
}

interface Error {
  status: string;
  message: string;
}
