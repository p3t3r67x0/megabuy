import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthGuard {
  constructor(private auth: AuthService,
    private data: DataService,
    private router: Router) { }

  getFullName(firstName, lastName, name) {
    if (firstName && lastName) {
      return firstName + ' ' + lastName;
    } else {
      return name;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.loginStatus(localStorage.getItem('token'))
      .then((user) => {
        // console.log(user.json());
        this.data.changeUserStatus(true);
        this.data.changeUserId(user.json().user_id);
        this.data.changeUserAvatar(environment.apiUrl + '/' + user.json().avatar);
        this.data.changeUserName(this.getFullName(user.json().firstname, user.json().lastname, user.json().name));
        this.data.changeUserConfirmed(user.json().confirmed);
        this.data.changeUserAddressId(user.json().address_id);
        return true;
      })
      .catch((err) => {
        // console.log(err.json());
        const url = this.router.url;
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login?redirect=' + url);
        return false;
      });
  }
}
