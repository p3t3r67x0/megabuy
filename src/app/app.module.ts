import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ModalComponent } from './components/modal/modal.component';

import { AuthService } from './services/auth.service';
import { EnsureAuthenticatedService } from './services/ensure-authenticated.service';
import { LoginRedirectService } from './services/login-redirect.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginRedirectService]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoginRedirectService]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [EnsureAuthenticatedService]
      }
    ])
  ],
  providers: [
    AuthService,
    EnsureAuthenticatedService,
    LoginRedirectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
