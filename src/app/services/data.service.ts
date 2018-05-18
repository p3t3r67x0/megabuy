import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private userStatus = new BehaviorSubject<boolean>(false);
  private userAdminStatus = new BehaviorSubject<string>('');
  currentUserStatus = this.userStatus.asObservable();
  currentAdminStatus = this.userAdminStatus.asObservable();

  constructor() { }

  changeStatus(userStatus) {
    this.userStatus.next(userStatus);
  }

  changeAdminStatus(userAdminStatus) {
    this.userAdminStatus.next(userAdminStatus);
  }

}
