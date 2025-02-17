import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = "http://localhost:8080/category";

  constructor(private httpClient: HttpClient) { }

  add(data: any){
    return this.httpClient.post(this.baseUrl + "/add", data);
  }

  update(data: any){
    return this.httpClient.post(this.baseUrl + "/update", data);
  }

  get(){
    return this.httpClient.get(this.baseUrl + "/get");
  }

  delete(id: number){
    return this.httpClient.delete(this.baseUrl + "/delete/" + id);
  }

  getCategoryWithFilterValue(){
    return this.httpClient.get(this.baseUrl + '/get?filterValue=true');
  }
}
