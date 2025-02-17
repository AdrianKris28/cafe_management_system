import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TokenInterceptorInterceptor } from './services/token-interceptor.interceptor';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ProfileComponent } from './profile/profile.component';
import { BillComponent } from './bill/bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    ForgotPasswordComponent,
    LoginComponent,
    DashboardComponent,
    ChangePasswordComponent,
    CategoryComponent,
    ProductComponent,
    ProductDetailsComponent,
    ManageOrderComponent,
    ProfileComponent,
    BillComponent,
    ManageUserComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, 
    MatButtonModule, 
    MatDividerModule, 
    MatIconModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    AutoCompleteModule
  ],
  providers: [HttpClientModule, {provide:HTTP_INTERCEPTORS, useClass:TokenInterceptorInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
