import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ModalComponent } from './components/modal/modal.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductCategoryTagComponent } from './components/product-category-tag/product-category-tag.component';
import { ProductUserTagComponent } from './components/product-user-tag/product-user-tag.component';
import { SearchComponent } from './components/search/search.component';
import { CategoryComponent } from './components/category/category.component';
import { UploadComponent } from './components/upload/upload.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { InboxDetailComponent } from './components/inbox-detail/inbox-detail.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ConfirmComponent } from './components/confirm/confirm.component';

import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { LayoutService } from './services/layout.service';
import { AuthGuard } from './services/ensure-authenticated.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { NgStringPipesModule } from 'angular-pipes';
import { ColorPipe } from './color.pipe';
import { ProfileComponent } from './components/profile/profile.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgStringPipesModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([
      {
        path: '',
        component: ProductsComponent
      },
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
        canActivate: [AuthGuard]
      },
      {
        path: 'product',
        component: ProductComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product-category',
        component: ProductCategoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'inbox',
        component: InboxComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'inbox/:id',
        component: InboxDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      },
      {
        path: 'category/:id',
        component: ProductCategoryTagComponent
      },
      {
        path: 'user/:id',
        component: ProductUserTagComponent
      },
      {
        path: 'confirm/:token',
        component: ConfirmComponent
      },
      {
        path: 'search/:query',
        component: ProductsComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    ModalComponent,
    PaginationComponent,
    ProductComponent,
    ProductsComponent,
    ProductCategoryComponent,
    SettingsComponent,
    ProductDetailComponent,
    ProductCategoryTagComponent,
    ProductUserTagComponent,
    SearchComponent,
    CategoryComponent,
    UploadComponent,
    InboxComponent,
    InboxDetailComponent,
    LayoutComponent,
    ColorPipe,
    ConfirmComponent,
    ProfileComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    LayoutService,
    LoginRedirectService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
