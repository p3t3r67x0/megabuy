import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard {
  constructor(private auth: AuthService,
    private data: DataService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.loginStatus(localStorage.getItem('token'))
      .then((user) => {
        // console.log(user.json());
        this.data.changeStatus(true);
        this.data.changeUserId(user.json().user_id);
        this.data.changeUserName(user.json().name);
        return true;
      })
      .catch((err) => {
        // console.log(err.json());
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
        return false;
      });
  }
}
