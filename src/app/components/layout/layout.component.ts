import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  backgroundColor: string;
  headlineColor: string;
  warningColor: string;
  successColor: string;
  navbarColor: string;
  teaserColor: string;
  buttonColor: string;
  errorColor: string;
  alertColor: string;
  infoColor: string;
  linkColor: string;
  textColor: string;

  token: string;
  layoutId: string;
  userId: string;
  url: string;

  constructor(private router: Router,
    private http: Http,
    private data: DataService,
    private layout: LayoutService) {
    this.data.currentUserId.subscribe(userId => this.userId = userId);

    this.layout.currentBackgroundColor.subscribe(backgroundColor => this.backgroundColor = backgroundColor);
    this.layout.currentHeadlineColor.subscribe(headlineColor => this.headlineColor = headlineColor);
    this.layout.currentWarningColor.subscribe(warningColor => this.warningColor = warningColor);
    this.layout.currentSuccessColor.subscribe(successColor => this.successColor = successColor);
    this.layout.currentNavbarColor.subscribe(navbarColor => this.navbarColor = navbarColor);
    this.layout.currentTeaserColor.subscribe(teaserColor => this.teaserColor = teaserColor);
    this.layout.currentButtonColor.subscribe(buttonColor => this.buttonColor = buttonColor);
    this.layout.currentAlertColor.subscribe(alertColor => this.alertColor = alertColor);
    this.layout.currentErrorColor.subscribe(errorColor => this.errorColor = errorColor);
    this.layout.currentTextColor.subscribe(textColor => this.textColor = textColor);
    this.layout.currentInfoColor.subscribe(infoColor => this.infoColor = infoColor);
    this.layout.currentLinkColor.subscribe(linkColor => this.linkColor = linkColor);
    this.layout.currentLayoutId.subscribe(layoutId => this.layoutId = layoutId);

    this.layout.getLayout(this.userId);

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
  }

  onColorChange() {
    const postData = {
      'background': this.backgroundColor,
      'headline': this.headlineColor,
      'warning': this.warningColor,
      'success': this.successColor,
      'navbar': this.navbarColor,
      'teaser': this.teaserColor,
      'button': this.buttonColor,
      'alert': this.alertColor,
      'error': this.errorColor,
      'info': this.infoColor,
      'link': this.linkColor,
      'text': this.textColor
    };

    this.layout.changeBackgroundColor(this.backgroundColor);
    this.layout.changeHeadlineColor(this.headlineColor);
    this.layout.changeWarningColor(this.warningColor);
    this.layout.changeSuccessColor(this.successColor);
    this.layout.changeNavbarColor(this.navbarColor);
    this.layout.changeButtonColor(this.buttonColor);
    this.layout.changeTeaserColor(this.teaserColor);
    this.layout.changeAlertColor(this.alertColor);
    this.layout.changeErrorColor(this.errorColor);
    this.layout.changeInfoColor(this.infoColor);
    this.layout.changeLinkColor(this.linkColor);
    this.layout.changeTextColor(this.textColor);

    this.layout.upadateLayout(this.layoutId, postData, this.token);
  }
}
