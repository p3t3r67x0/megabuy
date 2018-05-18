import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private BASE_URL: string;
  private headers: Headers;

  isAdmin: string;
  token: string;
  users: User[];
  error: any = {};
  editField: string;
  newCount: string;
  displayButton: boolean;

  loading = false;
  total = 0;
  page = 1;
  limit = 3;


  constructor(private router: Router,
    private http: Http,
    private data: DataService,
    private auth: AuthService) {
    this.BASE_URL = 'http://localhost:5000';
    this.headers = new Headers({ 'content-type': 'application/json' });
  }

  ngOnInit() {
    this.data.currentAdminStatus.subscribe(isAdmin => this.isAdmin = isAdmin);
    this.changeAdminStatus();
    this.getUsers();
  }


  getUsers() {
    this.token = localStorage.getItem('token');
    this.loading = true;

    this.loadUser(this.token, this.limit, this.page)
      .then((user) => {
        console.log(user.json());
        this.users = user.json().users;
        this.total = user.json().total;
        this.loading = false;
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

  changeAdminStatus() {
    this.isAdmin = localStorage.getItem('admin');
    this.data.changeAdminStatus(this.isAdmin);
  }

  updateEntry(user) {
    this.updateUser(user, this.token)
      .then((res) => {
        console.log(res.json());
      })
      .catch((err) => {
        console.log(err.json());
        this.error = err.json();
        if (err.status === 401) {
          console.log('status 401 what do we want to do?');
          localStorage.removeItem('token');
          this.router.navigateByUrl('/login');
        }
        // $('#myModal').modal();
      });
  }

  showInputField(public_id) {
    if (!this.editField || this.editField !== public_id) {
      this.editField = public_id;
    } else {
      this.editField = '';
    }
  }

  loadUser(token, limit, page) {
    let url: string;
    let headers: Headers;
    const params = new URLSearchParams();

    url = `${this.BASE_URL}/user`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    params.append('limit', limit);
    params.append('page', page);

    return this.http.get(url, { params: params, headers: headers }).toPromise();
  }

  updateUser(user, token) {
    let url: string;
    let headers: Headers;

    url = `${this.BASE_URL}/user/${user.public_id}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(url, user, { headers: headers }).toPromise();
  }

  goToPage(n: number): void {
    this.page = n;
    this.getUsers();
  }

  onNext(): void {
    this.page++;
    this.getUsers();
  }

  onPrev(): void {
    this.page--;
    this.getUsers();
  }
}
