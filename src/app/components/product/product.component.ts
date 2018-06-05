interface FormData {
  entries(): Iterator<[USVString, USVString | Blob]>;
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
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

  /**
   * By Ken Fyrstenberg Nilsen
   *
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   *
   * If image and context are only arguments rectangle will equal canvas
  */
  drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    /// default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

    /// keep bounds [0.0, 1.0]
    if (offsetX < 0) {
      offsetX = 0;
    }

    if (offsetY < 0) {
      offsetY = 0;
    }

    if (offsetX > 1) {
      offsetX = 1;
    }

    if (offsetY > 1) {
      offsetY = 1;
    }

    const iw = img.width;
    const ih = img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;  /// new prop. width
    let nh = ih * r;  /// new prop. height
    let cx, cy, cw, ch, ar = 1;

    /// decide which gap to fill
    if (nw < w) {
      ar = w / nw;
    }

    if (nh < h) {
      ar = h / nh;
    }

    nw *= ar;
    nh *= ar;

    /// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    /// make sure source rectangle is valid
    if (cx < 0) {
      cx = 0;
    }

    if (cy < 0) {
      cy = 0;
    }

    if (cw > iw) {
      cw = iw;
    }

    if (ch > ih) {
      ch = ih;
    }

    /// fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }


  onFileSelected(event, productId) {
    const self = this;
    for (const file of event.target.files) {
      if (file) {
        const reader = new FileReader();

        reader.onload = function(e: FileReaderEvent) {
          const canvas = <HTMLCanvasElement>document.getElementById('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image;

          img.onload = draw;

          function draw() {
            self.drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height, 0.5, 0.5);
            const wrapperDiv = document.createElement('div');
            wrapperDiv.setAttribute('class', 'margin-top-12 margin-left-12');

            const g = document.createElement('img');
            g.setAttribute('src', canvas.toDataURL());
            g.setAttribute('width', '100%');
            g.setAttribute('height', 'auto');

            wrapperDiv.appendChild(g);
            document.body.appendChild(wrapperDiv);

            const selectorId = 'thumbnail-' + productId;
            document.getElementById(selectorId).appendChild(wrapperDiv);

            canvas.toBlob(function(blob) {
              const form = new FormData();
              let headers: Headers;
              let url: string;

              form.append('image', blob, 'moody.jpg');
              form.append('product_id', productId);
              url = `${self.url}/image`;

              headers = new Headers({
                'Authorization': `Bearer ${self.token}`
              });

              self.http.put(url, form, { headers: headers }).toPromise();
            });
          }
          img.src = e.target.result;
        };

        reader.readAsDataURL(file);
      }
    }
  }


  showUpdateForm(productId) {
    if (!this.editField || this.editField !== productId) {
      this.editField = productId;
    } else {
      this.editField = '';
    }
  }

  getAllCurrencies() {
    this.http.get(`${this.url}/api/currencies`).subscribe(res => {
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

    url = `${this.url}/api/product/${product.id}`;
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

    url = `${this.url}/api/image/product/${productId}`;
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
          this.products[i].image = '';
          this.getAllImagesById(this.products[i].id)
            .then(res => {
              this.products[i].image = res.json().images;
            })
            .catch(err => {
              console.log(err);
            });
        }
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

    url = `${this.url}/api/product/user/${this.userId}`;
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

    url = `${this.url}/api/product-categories`;
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

    url = `${this.url}/api/product/${productId}`;
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
