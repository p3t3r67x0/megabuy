import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  sub: any;
  url: string;
  confirmToken: string;

  constructor(private route: ActivatedRoute,
    private data: DataService,
    private router: Router,
    private http: Http) {
    this.sub = this.route.params.subscribe(params => {
      this.confirmToken = params['token'];
    });
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    this.confirmUserAccount();
  }

  confirmUserAccount() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/confirm/${this.confirmToken}`;
    headers = new Headers({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, { headers: headers })
      .toPromise()
      .then((res) => {
        // console.log(res.json());

        if (res.json().status === 'success') {
          this.data.changeUserConfirmed(true);
          this.router.navigateByUrl('/product');
        }
      })
      .catch((err) => {
        // console.log(err.json());

        if (err.json().status === 'fail') {
          this.data.changeUserConfirmedMessage(err.json().message);
          localStorage.setItem('cm', err.json().message);
        }
      });
  }

}
