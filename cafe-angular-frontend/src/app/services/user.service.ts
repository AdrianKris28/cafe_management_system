import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = "http://localhost:8080/user";
  constructor(private httpClient:HttpClient) { }

  header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  signUp(data: any){
    return this.httpClient.post(this.baseUrl + "/signup", data, {
      headers:new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  forgotPassword(data: any){
    return this.httpClient.post(this.baseUrl + "/forgotPassword", data)
  }

  login(data: any){
    return this.httpClient.post(this.baseUrl + "/login", data)
  }

  changePassword(data: any){
    return this.httpClient.post(this.baseUrl + "/changePassword", data)
  }

  getAllUser(){
    return this.httpClient.get(this.baseUrl + '/get');
  }

  updateUserStatus(data:any){
    return this.httpClient.post(this.baseUrl + '/update', data);
  }

  uploadImage(data:FormData){
    return this.httpClient.post(this.baseUrl + "/uploadImage", data);
  }

  getImage(email:string){
    return this.httpClient.get(this.baseUrl + '/getImage/' + email);
  }

}
