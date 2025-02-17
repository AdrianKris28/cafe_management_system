import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  responseMessage: any;
  constructor(private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  clearResponseMessage(){
    this.responseMessage ="";
  }

  handleSubmit() {
    console.log(this.loginForm);
    var formData = this.loginForm.value;

    this.userService.login(formData).subscribe(
      (response: any) => {
        this.responseMessage = response.message;
        localStorage.setItem('token', response.message);
        this.router.navigate(['/cafe/dashboard']);
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        }
        else {
          this.responseMessage = "Failed to login";
        }
      }
    )
  }

}
