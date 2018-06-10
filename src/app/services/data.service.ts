import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  private userId = new BehaviorSubject<string>('0');
  private userName = new BehaviorSubject<string>('');
  private userStatus = new BehaviorSubject<boolean>(false);
  private userAdminStatus = new BehaviorSubject<string>('');
  private userConfirmed = new BehaviorSubject<boolean>(false);


  currentUserId = this.userId.asObservable();
  currentUserName = this.userName.asObservable();
  currentUserStatus = this.userStatus.asObservable();
  currentAdminStatus = this.userAdminStatus.asObservable();
  currentUserConfirmed = this.userConfirmed.asObservable();

  constructor() { }

  changeUserId(userId) {
    this.userId.next(userId);
  }

  changeUserName(userName) {
    this.userName.next(userName);
  }

  changeStatus(userStatus) {
    this.userStatus.next(userStatus);
  }

  changeUserConfirmed(userConfirmed) {
    this.userConfirmed.next(userConfirmed);
  }

  changeAdminStatus(userAdminStatus) {
    this.userAdminStatus.next(userAdminStatus);
  }
}
