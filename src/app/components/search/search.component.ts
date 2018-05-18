import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { User } from '../../models/user';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private BASE_URL: string;
  private headers: Headers;
  showDropDown = false;
  loading = false;
  total = 0;
  page = 1;
  limit = -1;
  token: string;
  users: User[];
  error: any = {};
  searchForm: FormGroup;

  constructor(private router: Router, private http: Http, private form: FormBuilder) {
    this.BASE_URL = 'http://localhost:5000';
    this.headers = new Headers({ 'content-type': 'application/json' });
    this.initForm();
  }

  initForm(): FormGroup {
    return this.searchForm = this.form.group({
      search: [null]
    });
  }

  selectValue(value) {
    this.searchForm.patchValue({ 'search': value });
    this.showDropDown = false;
  }

  closeDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  openDropDown() {
    this.showDropDown = false;
  }

  getSearchValue() {
    return this.searchForm.value.search;
  }

  toggleDropDown() {
    this.showDropDown = !this.showDropDown;
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

  ngOnInit() {
    this.getUsers();
  }

}
