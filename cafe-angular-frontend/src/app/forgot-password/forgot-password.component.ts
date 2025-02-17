import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm:any = FormGroup;
  responseMessage:any;
  
  constructor(private userService: UserService, 
    private formBuilder: FormBuilder,
    private router:Router){
  }

  ngOnInit(): void {
      this.forgotPasswordForm = this.formBuilder.group({
        email:[null, [Validators.email, Validators.required]]
      });
  }


  handleSubmit(){
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }

    console.log(data);
    
    this.userService.forgotPassword(data).subscribe(
      (response:any) => {
        this.responseMessage = response.message;
        this.router.navigate(['/']);
      }, (error) => {
        if(error.error?.message){
        this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Errors Occured";
        }
      }
    );
  }

}
