import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/product";

  constructor(private httpClient: HttpClient) { }

  addProduct(data:any){
    return this.httpClient.post(this.baseUrl + "/add", data);
  }
  getProducts(){
    return this.httpClient.get(this.baseUrl + "/get");
  }
  updateProduct(data:any){
    return this.httpClient.post(this.baseUrl + "/update", data);
  }
  updateStatus(data:any){
    return this.httpClient.post(this.baseUrl + "/updateStatus", data);
  }
  deleteProduct(productId:number){
    return this.httpClient.delete(this.baseUrl + "/delete/" + productId);
  }
  getProductByCategoryId(categoryId:number){
    return this.httpClient.get(this.baseUrl + "/getByCategory/" + categoryId);
  }

  getProductById(productId:number){
    return this.httpClient.get(this.baseUrl + "/getById/" + productId);
  }

  uploadProductImage(image:any, productId:number){
    return this.httpClient.post(this.baseUrl + "/uploadImage/" + productId, image);
  }

  getProductImage(productId:number){
    return this.httpClient.get(this.baseUrl + "/getImage/" + productId);
  }

}
