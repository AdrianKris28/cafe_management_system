import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { User } from 'src/model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit{

  allUser:User[] = [];
  user:User = new User;
  responseMessage:any;
  decodedToken:any;

  constructor(private userService:UserService){}

  ngOnInit(): void {
      this.getAllUser();
  }

  getCurrentUser():void{
    const token = localStorage.getItem('token');
    this.decodedToken = jwtDecode(token);
    const role =  this.decodedToken.role;
    const email =  this.decodedToken.sub;
  
    if(this.allUser){
    this.user = this.allUser.find(User => User.email === email);
    }
  }

  getAllUser(){
    this.userService.getAllUser().subscribe(
      (response:any) => {
        this.allUser = response;
        this.getCurrentUser();
      }
    )
  }

  changeStatus(userId:any){
    this.responseMessage = "";
    var user = this.allUser.find(user => user.id == userId);
    var data = {
      id: user.id,
      status: user.status
    }
    this.userService.updateUserStatus(data).subscribe(
      (response:any) => {
        this.responseMessage = response.message;
      }, (error:HttpErrorResponse) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to update user status.";
        }
      }
    )

  }

}
