import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { SplitPipe } from 'angular-pipes';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-category-tag',
  templateUrl: './product-category-tag.component.html',
  styleUrls: ['./product-category-tag.component.css']
})
export class ProductCategoryTagComponent implements OnInit, OnDestroy {
  private sub: any;
  url: string;
  categoryId: string;
  userId: string;
  products: any = [];
  error: any = {};

  constructor(private route: ActivatedRoute, private http: Http, private data: DataService, private auth: AuthService) { }

  ngOnInit() {
    this.url = environment.apiUrl;
    this.sub = this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getProducts();
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

  getProducts() {
    this.getAllProducts(this.categoryId)
      .then((products) => {
        // console.log(products.json().products);
        this.products = products.json().products;
        // this.products.image = this.products['thumbnail'].split(',')[0];
      })
      .catch((err) => {
        console.log(err);
        this.error = err.json();
      });
  }

  getAllProducts(categoryId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/category/${categoryId}`;
    headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers: headers }).toPromise();
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
