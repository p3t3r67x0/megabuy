import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class LoginRedirectService implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/product');
      return false;
    } else {
      return true;
    }
  }
}
