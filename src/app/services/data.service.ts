import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  private userId = new BehaviorSubject<string>('0');
  private userStatus = new BehaviorSubject<boolean>(false);
  private userAdminStatus = new BehaviorSubject<string>('');
  currentUserId = this.userId.asObservable();
  currentUserStatus = this.userStatus.asObservable();
  currentAdminStatus = this.userAdminStatus.asObservable();

  constructor() { }

  changeUserId(userId) {
    this.userId.next(userId);
  }

  changeStatus(userStatus) {
    this.userStatus.next(userStatus);
  }

  changeAdminStatus(userAdminStatus) {
    this.userAdminStatus.next(userAdminStatus);
  }
}
