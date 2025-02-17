import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = "http://localhost:8080/dashboard";

  constructor(private httpClient: HttpClient) { }

  getDetails(){
    return this.httpClient.get(this.baseUrl + "/details");
  }

  // getDetails(){
  //   // Create the HttpHeaders object and set the Access-Control-Allow-Origin header
  //   const headers = new HttpHeaders({
  //     'Access-Control-Allow-Origin': 'http://localhost:4200'
  //   });

  //   // Pass the headers object as the second parameter in the get() method
  //   return this.httpClient.get(this.baseUrl + "/details", { headers });
  // }
}
