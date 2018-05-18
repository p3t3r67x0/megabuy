import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private headers: Headers;
  private BASE_URL: string;
  private rForm: FormGroup;
  private product: Product;
  private token: string;
  private errorName: string;
  private description: string;
  private name: string;
  private loading: boolean;
  private error: Error;

  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
    this.BASE_URL = 'http://localhost:5000';
    this.headers = new Headers({
      'content-type': 'application/json'
    });
    this.errorName = 'This field is required';
    this.description = '';
    this.name = '';

    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      'category': [null, Validators.required],
      'validate': ''
    });
  }

  ngOnInit() {
    this.rForm.get('validate').valueChanges.subscribe((validate) => {
      if (validate) {
        this.rForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
        this.errorName = 'You need to specify at least 3 characters';
      } else {
        this.rForm.get('name').setValidators(Validators.required);
        this.errorName = 'This field is required';
      }

      this.rForm.get('name').updateValueAndValidity();
    });
  }

  addProduct(value): void {
    this.token = localStorage.getItem('token');
    this.loading = true;

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

    url = `${this.BASE_URL}/product`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(url, product, { headers: headers }).toPromise();
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
