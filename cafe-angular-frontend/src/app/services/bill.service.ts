import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private baseUrl = "http://localhost:8080/bill";
  constructor(private httpClient:HttpClient) { }

  generateReport(data:any){
    return this.httpClient.post(this.baseUrl + '/generateReport', data);
  }

  getPdf(data:any):Observable<Blob>{
    return this.httpClient.post(this.baseUrl + '/getPdf', data, {responseType:'blob'});
  }

  getBills(){
    return this.httpClient.get(this.baseUrl + '/getBills');
  }

  deleteBills(id:any){
    return this.httpClient.delete(this.baseUrl + '/delete/' + id);
  }
}
