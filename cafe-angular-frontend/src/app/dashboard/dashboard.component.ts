import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  
  responseMessage:any;
  data:any;
  message:any;

  constructor(private dashboardService: DashboardService,
    private router:Router,
    private route:ActivatedRoute){}

  ngOnInit(): void {
    this.dashboardData();
    this.route.queryParams.subscribe(params => {
      this.message = params['message']; // Use the message parameter as needed
  
    });
  }

  dashboardData() {
    
    this.dashboardService.getDetails().subscribe((response:any) => {
      this.data = response;
    }, (error:any) =>  {
      if(error.error?.message){
        this.responseMessage = error.error.message;
      }
      else{
        this.responseMessage = "Errors Occured";
      }
      console.log(this.responseMessage);
    }
    
    )
  }

  clearResponseMessage(){
    this.responseMessage = "";
    this.router.navigate(['/'])
  }
    
}
