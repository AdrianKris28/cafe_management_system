import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { User } from 'src/model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  user?:User = new User;
  allUser:User[] = [];
  url?:any;
  decodedToken:any;
  imageForm:any = FormGroup;
  responseMessage:any;
  file:any;

  @ViewChild('uploadImage') uploadImageInput: ElementRef;

  constructor(private userService:UserService, private router:Router, private formBuilder:FormBuilder, private _sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.getAllUser();
    this.imageForm = this.formBuilder.group({
      file: ['']
    });
  }
  

  getCurrentUser():void{
    const token = localStorage.getItem('token');
    this.decodedToken = jwtDecode(token);
    const role =  this.decodedToken.role;
    const email =  this.decodedToken.sub;
  
    if(this.allUser){
    this.user = this.allUser.find(User => User.email === email);
    // this.url = "http://localhost:8080/user/getImage/" + this.user.email;

    // this.url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.user.picByte);
    this.url = 'data:image/jpeg;base64,' + this.user.picByte;
    // console.log(this.retrievedImage);
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

  handleSubmitImageForm(){
    // debugger
    const formData = new FormData();
    formData.append('file', this.file);

    console.log(formData.get('file'));
    
    this.userService.uploadImage(formData).subscribe(
      (response:any) => {
        this.responseMessage = response.message;
        this.getAllUser();
      }, (error) =>{
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to upload an image."
        }
      }
    );
  }

  onFileSelected(event) {
    if(event.target.files.length > 0){
      if(event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png"){
        this.file = event.target.files[0];
      }else{
        this.responseMessage = "The input must be an image.";
        this.uploadImageInput.nativeElement.value = '';
      }
    }
  }

  clearResponseMessage(){
    this.responseMessage ="";
  }
}
