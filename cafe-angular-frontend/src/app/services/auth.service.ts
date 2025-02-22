import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  public isAuthenticated():Boolean{
    const token = localStorage.getItem('token');
    if(!token){
      this.router.navigate(['/']);
      return false;
    }else{
      return true;
    }
  }
}
