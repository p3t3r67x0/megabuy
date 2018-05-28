import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { SplitPipe } from 'angular-pipes';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private sub: any;
  url: string;
  productId: string;
  imageLength: string;
  userId: string;
  product: any = {};
  error: any = {};

  constructor(private route: ActivatedRoute, private http: Http, private data: DataService, private auth: AuthService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
    this.url = environment.apiUrl;
    this.checkUserStatus();
    this.getProductById();
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

  getProductById() {
    this.getOneProduct()
      .then((product) => {
        // console.log(product.json());
        this.product = product.json();
        this.imageLength = this.product.image.split(',').length;
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();
      });
  }

  getOneProduct() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/product/${this.productId}`;
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
