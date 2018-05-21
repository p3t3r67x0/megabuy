import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchComponent } from './components/search/search.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/ensure-authenticated.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { DataService } from './services/data.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { SearchFilterPipe } from './search-filter.pipe';
import { ProductDetailsComponent } from './components/product-details/product-details.component';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: ProductsComponent,
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
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product',
        component: ProductComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        component: ProductsComponent,
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
      { path: 'product/:id',
        component: ProductDetailsComponent
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
    SearchComponent,
    ClickOutsideDirective,
    SearchFilterPipe,
    ProductComponent,
    ProductsComponent,
    ProductCategoryComponent,
    SettingsComponent,
    ProductDetailsComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoginRedirectService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
