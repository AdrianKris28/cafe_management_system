import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from 'src/model/decodedToken';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{

  decodedToken: DecodedToken;

  constructor(public auth:AuthService,
    public router:Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        this.decodedToken = jwtDecode(token);
        const userRole = this.decodedToken.role;

        if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
          this.router.navigate(['/cafe/dashboard'], { queryParams: { message: "You are not Authorized to use this feature!" }});
          return false;
        }else{
          return true;
        }
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
    

}
