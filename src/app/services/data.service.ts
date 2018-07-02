import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  private isPublicPage = new BehaviorSubject<boolean>(false);
  private userConfirmedMessage = new BehaviorSubject<string>('');
  private userConfirmed = new BehaviorSubject<boolean>(false);
  private userAdminStatus = new BehaviorSubject<string>('');
  private userStatus = new BehaviorSubject<boolean>(false);
  private userAvatar = new BehaviorSubject<string>('');
  private userName = new BehaviorSubject<string>('');
  private userId = new BehaviorSubject<string>('');
  private userAddressId = new BehaviorSubject<string>('');
  private userToken = new BehaviorSubject<string>('');

  currentIsPublicPage = this.isPublicPage.asObservable();
  currentUserConfirmedMessage = this.userConfirmedMessage.asObservable();
  currentUserConfirmed = this.userConfirmed.asObservable();
  currentAdminStatus = this.userAdminStatus.asObservable();
  currentUserStatus = this.userStatus.asObservable();
  currentUserAvatar = this.userAvatar.asObservable();
  currentUserName = this.userName.asObservable();
  currentUserId = this.userId.asObservable();
  currentUserAddressId = this.userAddressId.asObservable();
  currentUserToken = this.userToken.asObservable();


  constructor() { }

  changeIsPublicPage(isPublicPage) {
    this.isPublicPage.next(isPublicPage);
  }

  changeUserAddressId(userAddressId) {
    this.userAddressId.next(userAddressId);
  }

  changeUserId(userId) {
    this.userId.next(userId);
  }

  changeUserName(userName) {
    this.userName.next(userName);
  }

  changeUserAvatar(userAvatar) {
    this.userAvatar.next(userAvatar);
  }

  changeUserStatus(userStatus) {
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

  changeUserToken(userToken) {
    this.userToken.next(userToken);
  }
}
