import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class LayoutService {
  private backgroundColor = new BehaviorSubject<string>('');
  private headlineColor = new BehaviorSubject<string>('');
  private warningColor = new BehaviorSubject<string>('');
  private successColor = new BehaviorSubject<string>('');
  private navbarColor = new BehaviorSubject<string>('');
  private teaserColor = new BehaviorSubject<string>('');
  private buttonColor = new BehaviorSubject<string>('');
  private alertColor = new BehaviorSubject<string>('');
  private errorColor = new BehaviorSubject<string>('');
  private infoColor = new BehaviorSubject<string>('');
  private linkColor = new BehaviorSubject<string>('');
  private textColor = new BehaviorSubject<string>('');
  private layoutId = new BehaviorSubject<string>('');

  currentBackgroundColor = this.backgroundColor.asObservable();
  currentHeadlineColor = this.headlineColor.asObservable();
  currentSuccessColor = this.successColor.asObservable();
  currentWarningColor = this.warningColor.asObservable();
  currentNavbarColor = this.navbarColor.asObservable();
  currentTeaserColor = this.teaserColor.asObservable();
  currentButtonColor = this.buttonColor.asObservable();
  currentAlertColor = this.alertColor.asObservable();
  currentErrorColor = this.errorColor.asObservable();
  currentInfoColor = this.infoColor.asObservable();
  currentLinkColor = this.linkColor.asObservable();
  currentTextColor = this.textColor.asObservable();
  currentLayoutId = this.layoutId.asObservable();

  token: string;
  url: string;

  constructor(private router: Router, private http: Http) {
    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
    this.getLayout();
  }

  changeBackgroundColor(backgroundColor) {
    this.backgroundColor.next(backgroundColor);
  }

  changeTextColor(textColor) {
    this.textColor.next(textColor);
  }

  changeHeadlineColor(headlineColor) {
    this.headlineColor.next(headlineColor);
  }

  changeNavbarColor(navbarColor) {
    this.navbarColor.next(navbarColor);
  }

  changeTeaserColor(teaserColor) {
    this.teaserColor.next(teaserColor);
  }

  changeButtonColor(buttonColor) {
    this.buttonColor.next(buttonColor);
  }

  changeSuccessColor(successColor) {
    this.successColor.next(successColor);
  }

  changeErrorColor(errorColor) {
    this.errorColor.next(errorColor);
  }

  changeInfoColor(infoColor) {
    this.infoColor.next(infoColor);
  }

  changeLinkColor(linkColor) {
    this.linkColor.next(linkColor);
  }

  changeAlertColor(alertColor) {
    this.alertColor.next(alertColor);
  }

  changeWarningColor(warningColor) {
    this.warningColor.next(warningColor);
  }

  changeLayoutId(layoutId) {
    this.layoutId.next(layoutId);
  }

  getLayout() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/layout`;
    headers = new Headers({
      'Content-Type': 'application/json',
    });

    return this.http.get(url, { headers: headers }).toPromise()
      .then(res => {
        this.changeBackgroundColor(res.json().layout.background);
        this.changeHeadlineColor(res.json().layout.headline);
        this.changeWarningColor(res.json().layout.warning);
        this.changeSuccessColor(res.json().layout.success);
        this.changeNavbarColor(res.json().layout.navbar);
        this.changeTeaserColor(res.json().layout.teaser);
        this.changeButtonColor(res.json().layout.button);
        this.changeAlertColor(res.json().layout.alert);
        this.changeErrorColor(res.json().layout.error);
        this.changeInfoColor(res.json().layout.info);
        this.changeLinkColor(res.json().layout.link);
        this.changeTextColor(res.json().layout.text);
        this.changeLayoutId(res.json().layout.id);
      })
      .catch(err => {
        console.log(err);
      });
  }

}
