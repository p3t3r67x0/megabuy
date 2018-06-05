import { Component, OnInit, OnDestroy } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  url: string;
  limit: number;
  page: number;
  token: string;
  error: any = {};
  products: any = [];
  userId: string;
  query: string;
  sub: any;

  constructor(private route: ActivatedRoute, private http: Http, private data: DataService, private auth: AuthService) { }

  ngOnInit() {
    this.data.currentUserId.subscribe(userId => this.userId = userId);
    this.url = environment.apiUrl;
    this.limit = -1;
    this.page = 1;
    this.sub = this.route.params.subscribe(params => {
      this.query = params['query'];

      if (this.query) {
        this.queryProducts();
      } else  {
        this.getAllProducts();
      }
    });

    this.checkUserStatus();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkUserStatus() {
    this.auth.loginStatus(localStorage.getItem('token'))
      .then((user) => {
        // console.log(user.json());
        this.changeStatus();
        this.changeUserId(user.json().user_id);
        this.changeUserName(user.json().name);
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  getAllProducts() {
    this.loadProducts(this.limit, this.page)
      .then((products) => {
        // console.log(products.json());
        this.products = products.json().products;
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();
      });
  }

  loadProducts(limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.url}/api/products`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
  }

  queryProducts() {
    this.getQueryProducts(this.limit, this.page)
      .then((products) => {
        // console.log(products);
        this.products = products.json().products;
      })
      .catch((err) => {
        console.log(err);
        this.error = err.json();
      });
  }

  getQueryProducts(limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.url}/api/search/${this.query}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
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
