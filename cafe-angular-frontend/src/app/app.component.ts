import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from 'src/model/decodedToken';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'cafe-angular-frontend';
  // token?: string = localStorage.getItem('token');
  decodedToken: DecodedToken;

  constructor(private router:Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem('token');
    if (user) {
      return true;
    }
    return false;
  }

  public isAdmin(): boolean{
    const token = localStorage.getItem('token');
    this.decodedToken = jwt_decode(token);
    const role =  this.decodedToken.role;
    const email =  this.decodedToken.sub;
    const iat =  this.decodedToken.iat;
    const exp = this.decodedToken.exp;

    if(role == "ADMIN"){
      return true;
    }else{
      return false;
    }
  }

  public logout(){
    localStorage.clear();
    this.router.navigate(['/']);
  }

}


