import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Category } from 'src/model/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  allCategory: Category[];
  errorMessage:any;
  addCategoryForm: any = FormGroup;
  updateCategoryForm: any = FormGroup;
  successMessage:any;
  updatedCategory:Category;
  visible:boolean = false;
  selectedCategoryId:number;

  selectedCategory:string;
  filteredCategory:Category[];
  filteredCategoryNames:string[] = [];

  constructor(private categoryService: CategoryService, 
    private router:Router, 
    private formBuilder: FormBuilder,
    private route:ActivatedRoute){}

  ngOnInit(): void {
      this.getAllCategory();
      this.addCategoryForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.minLength(3)]]
      })
  }

  search(event: AutoCompleteCompleteEvent){
    console.log(event);
    this.filteredCategory = this.allCategory.filter(Category => Category.name.toLowerCase().includes(event.query.toLowerCase()));
    this.filteredCategoryNames = this.filteredCategory.map(category => category.name);
    console.log(this.filteredCategoryNames);
  }
  
  showDialog(categoryId:number){
    this.visible = true;
    this.selectedCategoryId = categoryId;
  }

  getAllCategory(){
    this.categoryService.get().subscribe(
      (response:any) => {
        this.allCategory = response;
      }, (error) => {
        if(error.error?.message){
          this.errorMessage = error.error.message;
        }else{
          this.errorMessage = "Error Occured";
        }
      }
    )
  }

  handleAddCategorySubmit(){
    var formData = this.addCategoryForm.value;
    this.categoryService.add(formData).subscribe(
      (response:any) => {
        this.successMessage = response.message;
        document.getElementById('addCategoryModalCloseBtn').click();
        this.getAllCategory();
        this.addCategoryForm.reset();
      }, (error) => {
        if(error.error?.message){
          this.errorMessage = error.error.message;
        }else{
          this.errorMessage = "Error Occured";
        }
      }
    )
  }

  handleUpdateCategorySubmit(){
    var formData = this.updateCategoryForm.value;
    this.categoryService.update(formData).subscribe(
        (response:any) => {
          this.successMessage = response.message;
          document.getElementById("updateCategoryModalCloseBtn").click();
          this.getAllCategory();
          this.updateCategoryForm.reset();
        }, (error) => {
          if(error.error?.message){
            this.errorMessage = error.error.message;
          }else{
            this.errorMessage = "Failed to update category.";
          }
        }
    )
  }

  updateCategory(id:number): void{
    this.updatedCategory = this.allCategory.find(Category => Category.id == id);
    this.updateCategoryForm = this.formBuilder.group({
      id: [this.updatedCategory.id, [Validators.required]],
      name: [this.updatedCategory.name, [Validators.required, Validators.minLength(3)]]
    });
    console.log(this.updateCategoryForm.value);
  }

  filterCategory(name: String): void{
    if(name){
      this.allCategory = this.allCategory.filter(Category => Category.name.toLowerCase().includes(name.toLowerCase()));
    }
    else{
      this.getAllCategory();
    }
  }

  deleteCategory(id:number){
    this.categoryService.delete(id).subscribe(
      (response:any) => {
        this.successMessage = response.message;
        this.getAllCategory();
        this.router.navigate(['/category']);
      }, (error) => {
        if(error.error?.message){
          this.errorMessage = error.error.message;
        }else{
          this.errorMessage = "Failed to delete category.";
        }
      }
    )
  }

}
