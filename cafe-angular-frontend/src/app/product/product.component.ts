import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/model/category';
import { Product } from 'src/model/product';
import { ProductCountForCategory } from 'src/model/productCountForCategory';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  name:any;
  responseMessage:any;
  allProduct:Product[];
  addProductForm:any = FormGroup;
  updateProductForm:any = FormGroup;
  allCategory:Category[];
  updatedProduct:Product;
  selectedProduct:Product;

  allCategoryButton:boolean;
  activeCategory: number;

  //2 object below is experiment to push object into array object and display the count for product within each category
  productCountForCategoryArray:ProductCountForCategory[] = [];
  productCountForCategory:ProductCountForCategory;
  
  constructor(private productService:ProductService,
    private router:Router,
    private formBuilder:FormBuilder,
    private categoryService:CategoryService){}

  ngOnInit(): void {
      this.getAllProduct();
      this.getAllCategory();
      this.addProductForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.minLength(4)]],
        description: [null, [Validators.required, Validators.minLength(10)]],
        price: [null, [Validators.required, Validators.min(5000)]],
        categoryId: [null, [Validators.required]]
      })

  }

  clearResponseMessage(){
    this.responseMessage = "";
  }

  getAllCategory(){
    this.categoryService.get().subscribe(
      (response:any) => {
        this.allCategory = response;

        //code below is experiment to push object into array object and display the count for product within each category
        if(this.allProduct){
        for(let i=0; i < this.allCategory.length; i++){
          const products = this.allProduct.filter(Product => Product.categoryId === this.allCategory[i].id);
          // console.log(products);
          this.productCountForCategory = {
            categoryId: this.allCategory[i].id,
            categoryName: this.allCategory[i].name,
            count: products.length
          };
          this.productCountForCategoryArray.push(this.productCountForCategory);
        }
      }

      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Error Occured";
        }
      }
    )
  }
  
  getAllProduct(){
    this.activeCategory = null;
    this.allCategoryButton = true;
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

  filterProduct(name: string){
    if(name){
      this.allProduct = this.allProduct.filter(Product => Product.name.toLowerCase().includes(name.toLowerCase()));
    }
    else{
      this.getAllProduct();
    }
  }

  handleAddProductSubmit(){
    var formData = this.addProductForm.value;
    this.productService.addProduct(formData).subscribe(
      (response:any) => {
        document.getElementById('addProductModalCloseBtn').click();
        this.responseMessage = response.message;
        this.getAllProduct();
        this.router.navigate(['/product']);
        this.addProductForm.reset();
      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to add product.";
        }
      }
    )
  }

  changeStatus(productId: number, status: string){
    var data = {
      id: productId,
      status: status
    }

    console.log(data);
    this.productService.updateStatus(data).subscribe(
      (response:any) => {
        this.responseMessage = response.message;
        this.getAllProduct;
        this.router.navigate(['/product']);
      }, (error) => {
        console.log(error);
      }
    )
  }

  updateProduct(productId: number){
    this.updatedProduct = this.allProduct.find(Product => Product.id == productId);

    this.updateProductForm = this.formBuilder.group({
      id: [this.updatedProduct.id],
      name: [this.updatedProduct.name, [Validators.required, Validators.minLength(4)]],
      description: [this.updatedProduct.description, [Validators.required, Validators.minLength(10)]],
      price: [this.updatedProduct.price, [Validators.required, Validators.min(5000)]],
      categoryId: [this.updatedProduct.categoryId, [Validators.required]]
    })
  }

  handleUpdateProductSubmit(){
    var formData = this.updateProductForm.value;
    this.productService.updateProduct(formData).subscribe(
      (response:any) => {
        document.getElementById('updateProductModalCloseBtn').click();
        this.responseMessage = response.message;
        this.getAllProduct();
      }, (error) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to update product data."
        }
      }
    )
  }
  
  deleteProduct(productId:number){
    this.productService.deleteProduct(productId).subscribe(
      (response:any) => {
        document.getElementById('deleteProductCloseBtn').click();
        this.responseMessage = response.message;
        this.getAllProduct();
      },
      (error:HttpErrorResponse) => {
        if(error.error.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = "Cannot delete this product!";
        }
      }
    )
  }

  selectProduct(productId:number){
    this.responseMessage = '';
    this.selectedProduct = this.allProduct.find(product => product.id == productId);
    // console.log(this.selectedProduct);
  }

  getProductByCategory(categoryId:number){
    this.activeCategory = categoryId;
    this.allCategoryButton = false;
    this.responseMessage = "";
      this.productService.getProductByCategoryId(categoryId).subscribe(
        (response: any) => {
          this.allProduct = response;
        },(error) => {
          if(error.error?.message){
            this.getAllProduct();
            this.responseMessage = error.error.message;
          }else{
            this.getAllProduct();
            var category = this.allCategory.find(Category => Category.id === categoryId);
            this.responseMessage = "Failed to load product by category " + category.name; 
          }
        }
      )
  }

}
