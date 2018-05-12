import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private userStatus = new BehaviorSubject<boolean>(false);
  currentUserStatus = this.userStatus.asObservable();

  constructor() { }

  changeStatus(userStatus) {
    this.userStatus.next(userStatus);
  }

}
