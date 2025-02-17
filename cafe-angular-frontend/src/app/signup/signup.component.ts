import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  password = true;
  confirmPassword = true;
  responseMessage:any;
  signUpForm:any = FormBuilder;
  numberRegex = /^[0-9]+$/;

  constructor(private userService: UserService, 
    private router: Router,
    private formBuilder: FormBuilder){
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.email]],
      contactNumber: [null, [Validators.required, Validators.pattern(this.numberRegex)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });
  }
  

  validateSubmit(){
    if(this.signUpForm.controls['password'].value == this.signUpForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  handleSubmit(){

    if(this.validateSubmit()){
        if(this.signUpForm.valid){
          var formData = this.signUpForm.value;
          var data = {
            name: formData.name,
            email:formData.email,
            contactNumber: formData.contactNumber,
            password: formData.password
          }

          this.userService.signUp(data).subscribe(
            (response: any) => {
              this.responseMessage = response?.message;
              this.router.navigate(['/']);
            },(error) => {
              if(error.error?.message){
                this.responseMessage = error.error.message;
              }
              else{
                this.responseMessage = "Errors Occured";
              }
            }
          )
        }
    }else{
      this.responseMessage = "New Password and New Password Confirmation does not match.";
    }
  }


}
