import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';


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
  rForm: FormGroup;
  headers: Headers;
  product: Product;
  editField: string;
  loading: boolean;
  token: string;
  description: string;
  name: string;
  error: Error;
  errorName: string;
  products: any = [];
  productCategories: any = [];

  constructor(private fb: FormBuilder,
              private http: Http,
              private router: Router,
              private data: DataService) {
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.headers = new Headers({
      'content-type': 'application/json'
    });
    this.getProductCategories();
    this.errorName = 'This field is required';
    this.description = '';
    this.name = '';

    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      'category': [null, Validators.required],
      'thumbnail': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.limit = -1;
    this.page = 1;
    this.getProducts();
  }

  showUpdateForm(productId) {
    if (!this.editField || this.editField !== productId) {
      this.editField = productId;
    } else {
      this.editField = '';
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.rForm.get('thumbnail').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  updateEntry(product) {
    this.updateProduct(product, this.token)
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

  updateProduct(product, token) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/${product.id}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, product, { headers: headers }).toPromise();
  }

  getProductCategories() {
    this.loadProductCategories(this.token, -1, 1)
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

  addProduct(value): void {
    this.loading = true;
    console.log(value);
    this.postProduct(this.token, value)
      .then((user) => {
        console.log(user.json());
        if (user.json().status === 'success') {
          this.rForm.reset();
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

  postProduct(token, product): Promise<any> {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(url, product, { headers: headers }).toPromise();
  }

  removeProduct(productId) {
    this.deleteProduct(this.token, productId)
      .then((product) => {
        console.log(product.json());
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

  getProducts() {
    this.loadProducts(this.token, this.limit, this.page)
      .then((products) => {
        console.log(products.json());
        this.products = products.json().products;
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

  loadProducts(token, limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.url}/product`;
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
