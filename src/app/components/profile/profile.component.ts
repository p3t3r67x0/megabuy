import { Component, OnInit, Input } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LayoutService } from '../../services/layout.service';
import { environment } from '../../../environments/environment';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
}

interface FileReaderEventTarget extends EventTarget {
  result: string;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() name: string;
  @Input() userName: string;

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

  url: string;
  token: string;
  userId: string;

  constructor(private http: Http,
    private layout: LayoutService,
    private data: DataService) {
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

    this.token = localStorage.getItem('token');
    this.url = environment.apiUrl;
  }

  ngOnInit() {
    const self = this;
    const hiddenFileUpload = document.getElementById('realFileUpload');
    const customFileUpload = document.getElementById('cutomFileUpload');
    const avatarImage = <HTMLImageElement>document.getElementById('avatarImage');

    customFileUpload.addEventListener('click', function() {
      hiddenFileUpload.click();
    });

    hiddenFileUpload.addEventListener('change', function(event: HTMLInputEvent) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function(e: FileReaderEvent) {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image;

        img.onload = draw;

        function draw() {
          self.drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height, 0.5, 0.5);
          const dataUrl = canvas.toDataURL();
          avatarImage.src = dataUrl;
          self.data.changeUserAvatar(dataUrl);

          canvas.toBlob(function(blob) {
            const form = new FormData();
            let headers: Headers;
            let url: string;

            form.append('image', blob);
            form.append('user_id', self.userId);
            url = `${self.url}/api/user/image/${self.userId}`;

            headers = new Headers({
              'Authorization': `Bearer ${self.token}`
            });

            self.http.put(url, form, { headers: headers })
              .toPromise()
              .then(res => {
                // console.log(res);
              })
              .catch(err => {
                console.log(err);
              });
          });
        }

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });

    this.getUserById();
  }

  getUserById() {
    let url: string;
    let headers: Headers;

    url = `${this.url}/api/user/${this.userId}`;
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    });

    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(res => {
        // console.log(res.json());
        const avatarImage = <HTMLImageElement>document.getElementById('avatarImage');
        avatarImage.src = this.url + '/' + res.json().user.avatar;
      })
      .catch(err => {
        console.log(err.json());
      });
  }



  /**
   * By Ken Fyrstenberg Nilsen
   *
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   *
   * If image and context are only arguments rectangle will equal canvas
  */
  drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
    }

    /// default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

    /// keep bounds [0.0, 1.0]
    if (offsetX < 0) {
      offsetX = 0;
    }

    if (offsetY < 0) {
      offsetY = 0;
    }

    if (offsetX > 1) {
      offsetX = 1;
    }

    if (offsetY > 1) {
      offsetY = 1;
    }

    const iw = img.width;
    const ih = img.height;
    const r = Math.min(w / iw, h / ih);
    let nw = iw * r;  /// new prop. width
    let nh = ih * r;  /// new prop. height
    let cx, cy, cw, ch, ar = 1;

    /// decide which gap to fill
    if (nw < w) {
      ar = w / nw;
    }

    if (nh < h) {
      ar = h / nh;
    }

    nw *= ar;
    nh *= ar;

    /// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    /// make sure source rectangle is valid
    if (cx < 0) {
      cx = 0;
    }

    if (cy < 0) {
      cy = 0;
    }

    if (cw > iw) {
      cw = iw;
    }

    if (ch > ih) {
      ch = ih;
    }

    /// fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }
}
