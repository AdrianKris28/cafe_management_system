import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  
  changePasswordForm: any = FormGroup;
  responseMessage: any;
  
  constructor(private userService: UserService,
    private router:Router, 
    private formBuilder: FormBuilder){}

    ngOnInit(): void {
        this.changePasswordForm = this.formBuilder.group({
          oldPassword: [null, [Validators.required]],
          newPassword: [null, [Validators.required]],
          newPasswordConfirmation: [null, [Validators.required]]
        })
    }

    validateNewPassword():boolean{
      var formData = this.changePasswordForm.value;
      if(formData.newPassword != formData.newPasswordConfirmation){
        return false;
      }else{
        return true;
      }
    }

    handleSubmit(){
      this.responseMessage = "";
      var formData = this.changePasswordForm.value;
      var data = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      }
      if(this.validateNewPassword()){
          this.userService.changePassword(data).subscribe(
            (response:any) => {
                this.responseMessage = response.message;
                this.router.navigate(['/cafe/dashboard'], { queryParams: { message: this.responseMessage }});
            }, (error) => {
              if(error.error?.message){
                this.responseMessage = error.error.message;
              }else{
                this.responseMessage = "Error Occured";
              }
            }
          )
      }else{
        this.responseMessage = "New Password and New Password Confirmation does not match.";
      }
    }


}
