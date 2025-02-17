import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouteGuardService } from './services/route-guard.service';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ProfileComponent } from './profile/profile.component';
import { BillComponent } from './bill/bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [ 
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'cafe/dashboard', component: DashboardComponent, canActivate:[RouteGuardService]},
  {path: 'signup', component: SignupComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'login', component: LoginComponent},
  {path: 'category', component: CategoryComponent, canActivate:[RouteGuardService], data:{role:['ADMIN']}},
  {path: 'product-details/:id', component: ProductDetailsComponent, canActivate:[RouteGuardService]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate:[RouteGuardService], data:{role:['ADMIN', 'USER']}},
  {path: 'product', component: ProductComponent, canActivate:[RouteGuardService], data:{role:['ADMIN', 'USER']}},
  {path: 'order', component: ManageOrderComponent, canActivate:[RouteGuardService], data:{role:['ADMIN', 'USER']}},
  {path: 'profile', component: ProfileComponent, canActivate:[RouteGuardService]},
  {path: 'bill', component: BillComponent, canActivate:[RouteGuardService]},
  {path: 'manage-user', component: ManageUserComponent, canActivate:[RouteGuardService], data:{role:['ADMIN']}},
  {path: 'not-found', component:PageNotFoundComponent},
  {path: '**', redirectTo:'/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
