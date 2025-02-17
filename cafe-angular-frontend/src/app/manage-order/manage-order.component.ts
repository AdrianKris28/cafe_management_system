import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jwtDecode from 'jwt-decode';
import { Category } from 'src/model/category';
import { Product } from 'src/model/product';
import { User } from 'src/model/user';
import { BillService } from '../services/bill.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit{
  
  price:number=0;
  totalPrice:number=0;
  quantity:number=0;
  totalAmount:number=0;
  manageOrderForm:any = FormGroup;
  addedProduct:any = [];
  responseMessage:any;
  // allUser:User[] = [];
  // user:User;
  numberRegex = /^[0-9]+$/;
  allCategory:Category[]=[];
  selectedCategory:number=null;
  selectedProduct:number=null;
  allProductByCategory:Product[]=[];
  allProduct:Product[] = [];

  decodedToken:any;
  constructor(private billService:BillService, private formBuilder:FormBuilder, private userService:UserService, private categoryService:CategoryService, private productService:ProductService){}

  ngOnInit(): void {
    // this.getAllUser();
    // this.getCurrentUser();
    this.getAllCategory();
    this.getAllProduct();

    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      contactNumber: [null, [Validators.required, Validators.pattern(this.numberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]]
    })    

  }

  setSelectedCategory(categoryId:number){
    this.selectedCategory = categoryId;
    if(this.selectedCategory > 0){
    this.getListProductSelectedCategory();
    this.price = 0;
    this.quantity = 0;
    this.totalPrice = 0;
    }
  }

  setSelectedProduct(productId:number){
    this.selectedProduct = productId;
    if(this.selectedProduct != null) {
    this.price = this.allProductByCategory.find(Product => Product.id == this.selectedProduct)?.price;
    }
  }

  setTotalPrice(){
    this.totalPrice = this.price * this.quantity;
  }

  getListProductSelectedCategory(){
    this.productService.getProductByCategoryId(this.selectedCategory).subscribe(
      (response:any) => {
        this.allProductByCategory = response;
      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to load products";
        }
      }
    )
  }

  getAllCategory(){
    this.categoryService.getCategoryWithFilterValue().subscribe(
      (response:any) => {
        this.allCategory = response;
      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to load all category";
        }
      }
    )
  }

  getAllProduct(){
    this.productService.getProducts().subscribe(
      (response:any) => {
        this.allProduct = response;
      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to load products data.";
        }
      }
    )
  }

  // getAllUser(){
  //   this.userService.getAllUser().subscribe(
  //     (response:any) => {
  //       this.allUser = response;
  //       this.getCurrentUser();
  //     }
  //   )
  // }

  // getCurrentUser():void{
  //     const token = localStorage.getItem('token');
  //     this.decodedToken = jwtDecode(token);
  //     const role =  this.decodedToken.role;
  //     const email =  this.decodedToken.sub;
    
  //     if(this.allUser.length){
  //     this.user = this.allUser.find(User => User.email === email);
  //     }
  // }

  addOrderToArray(){
    this.responseMessage = "";
    if(this.manageOrderForm.valid){
      var formData = this.manageOrderForm.value;
      var email = this.manageOrderForm.value.email;
      var emailExist = this.addedProduct.find((addedProduct) => addedProduct.email === email);
      // this.totalAmount = this.totalAmount + this.totalPrice;

      if(!emailExist){
        // console.log("inside if");
        var data = {
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          paymentMethod: formData.paymentMethod,
          productDetails: [{
            id: formData.product,
            name: this.allProduct.find(product => product.id == formData.product).name.toString(),
            categoryId: formData.category,
            category: this.allCategory.find(category => category.id == formData.category).name.toString(),
            price: this.price,
            quantity: this.quantity,
            total: this.totalPrice
           }],
          totalAmount: this.totalPrice 
        }
      this.addedProduct.push(data);
    }else{
      // console.log("inside else");
      var productExist = emailExist.productDetails.find(existingProduct => existingProduct.id == formData.product);

      if(productExist){
        emailExist.productDetails.find(existingProduct => existingProduct.id == formData.product).quantity = this.quantity;
        emailExist.productDetails.find(existingProduct => existingProduct.id == formData.product).total = this.totalPrice;

        // Calculate the total inside productDetails
        var productDetailsTotal = 0;
        emailExist.productDetails.forEach(function(product) {
          productDetailsTotal += product.total;
        });
        emailExist.totalAmount = productDetailsTotal;

      }else{
        var additionalProduct = {
          id: formData.product,
          name: this.allProduct.find(product => product.id == formData.product).name.toString(),
          categoryId: formData.category,
          category: this.allCategory.find(category => category.id == formData.category).name.toString(),
          price: this.price,
          quantity: this.quantity,
          total: this.totalPrice
        }
        emailExist.totalAmount = emailExist.totalAmount + this.totalPrice;
        emailExist.productDetails.push(additionalProduct);
      }

    }

  }

    this.responseMessage = "Successfully add new order.";
    this.manageOrderForm.get('category').patchValue(null);
    this.manageOrderForm.get('product').patchValue(null);
    this.price = 0;
    this.quantity = 0;
    this.totalPrice = 0;
    
  }

  removeOrder(productId:number, email:string){
    // debugger
    var tempData = this.addedProduct.find(product => product.email === email);
    tempData.totalAmount = tempData.totalAmount - tempData.productDetails.find(product => product.id == productId).total;
    tempData.productDetails = tempData.productDetails.filter(product => product.id != productId);
  
  }

  submitOrderForm(email:string){
    // debugger
    var data = this.addedProduct.find(product => product.email === email);
    this.responseMessage = "";
    this.billService.generateReport(data).subscribe(
      (response:any) => {
        this.responseMessage = response.message;
      }, (error:HttpErrorResponse) => {
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = "Failed to generate the report."
        }
      }
    )
  }

}
