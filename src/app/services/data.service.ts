import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  private userConfirmedMessage = new BehaviorSubject<string>('');
  private userConfirmed = new BehaviorSubject<boolean>(false);
  private userAdminStatus = new BehaviorSubject<string>('');
  private userStatus = new BehaviorSubject<boolean>(false);
  private userAvatar = new BehaviorSubject<string>('');
  private userName = new BehaviorSubject<string>('');
  private userId = new BehaviorSubject<string>('0');

  currentUserConfirmedMessage = this.userConfirmedMessage.asObservable();
  currentUserConfirmed = this.userConfirmed.asObservable();
  currentAdminStatus = this.userAdminStatus.asObservable();
  currentUserStatus = this.userStatus.asObservable();
  currentUserAvatar = this.userAvatar.asObservable();
  currentUserName = this.userName.asObservable();
  currentUserId = this.userId.asObservable();

  constructor() { }

  changeUserId(userId) {
    this.userId.next(userId);
  }

  changeUserName(userName) {
    this.userName.next(userName);
  }

  changeUserAvatar(userAvatar) {
    this.userAvatar.next(userAvatar);
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

  changeUserConfirmedMessage(userConfirmedMessage) {
    this.userConfirmedMessage.next(userConfirmedMessage);
  }
}
