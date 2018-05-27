import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { SplitPipe } from 'angular-pipes';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-user-tag',
  templateUrl: './product-user-tag.component.html',
  styleUrls: ['./product-user-tag.component.css']
})
export class ProductUserTagComponent implements OnInit, OnDestroy {
  private sub: any;
  url: string;
  userId: string;
  products: any = [];
  error: any = {};

  constructor(private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private data: DataService,
    private auth: AuthService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    this.url = environment.apiUrl;
    this.checkUserStatus();
    this.getProducts();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showProducts(products) {
    this.router.navigateByUrl('/');
  }

  checkUserStatus() {
    this.auth.loginStatus(localStorage.getItem('token'))
      .then((user) => {
        console.log(user.json());
        this.changeStatus();
        this.changeUserId(user.json().user_id);
        this.changeUserName(user.json().name);
      })
      .catch((err) => {
        console.log(err.json());
      });
  }

  getProducts() {
    this.getAllProducts(this.userId)
      .then((products) => {
        // console.log(products.json().products);
        this.products = products.json().products;
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();
      });
  }

  getAllProducts(userId) {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/user/${userId}`;
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
