import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private url: string;
  private limit: number;
  private page: number;
  private token: string;
  private error: any = {};
  private products: any = [];

  constructor(private http: Http, private router: Router) { }

  ngOnInit() {
    this.url = 'http://localhost:5000';
    this.limit = -1;
    this.page = 1;
    this.getProducts();
  }

  getProducts() {
    this.token = localStorage.getItem('token');
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

}
