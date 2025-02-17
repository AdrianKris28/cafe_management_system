import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/model/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  productId:number;
  product:Product = new Product;
  responseMessage:any;
  file:any;
  @ViewChild('uploadImage') uploadImageInput: ElementRef;
  imageUrl:any;
  
  constructor(private productService:ProductService, 
    private router:Router,
    private route:ActivatedRoute,
    private _sanitizer: DomSanitizer){}

  ngOnInit(): void {
      this.productId = this.route.snapshot.params['id'];
      this.getProductById(this.productId);
  }

  getProductById(productId:number){
    this.productService.getProductById(this.productId).subscribe(
      (response:any) => {
        this.product = response;
        this.imageUrl = 'data:image/jpeg;base64,' + this.product.image;
      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to load product data."
        }
      }
    )
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

  handleSubmitImageForm(){
    // debugger
    if(this.file){
      const formData = new FormData();
      formData.append('file', this.file);

      console.log(formData.get('file'));
      
      this.productService.uploadProductImage(formData, this.product.id).subscribe(
        (response:any) => {
          this.responseMessage = response.message;
          this.getProductById(this.productId);
        }, (error) =>{
          if(error.error?.message){
            this.responseMessage = error.error.message;
          }else{
            this.responseMessage = "Failed to upload an image."
          }
        }
      );
    }else{
      this.responseMessage = "You didnt choose image yet!";
    }
  }


}
