import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Bill } from 'src/model/bill';
import { BillService } from '../services/bill.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit{

  responseMessage:any;
  allBill:Bill[] = [];
  bill:Bill = new Bill;

  productDetail:any;

  constructor(private billService:BillService){}

  ngOnInit(): void {
    this.getAllBill();
  }

  getAllBill(){
    this.billService.getBills().subscribe(
      (response:any) => {
        this.allBill = response;

        for(var i=0; i<this.allBill.length; i++){
          this.allBill[i].productDetail = JSON.parse(this.allBill[i].productDetail);
        }
        // JSON.stringify(this.allBill.productDetail);
        console.log(this.allBill);
   
      }, (error:HttpErrorResponse) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }else{
          this.responseMessage = "Failed to load bill data.";
        }
      }
    )
  }

  viewBill(id:number){
    this.bill = this.allBill.find(bill => bill.id == id);
  }
  
  deleteBill(id:number){
    this.responseMessage = "";
    this.billService.deleteBills(id).subscribe(
      (response:any) => {
        this.responseMessage = response.message;
      }, (error:HttpErrorResponse) => {
        if(error.error?.message){
          this.responseMessage = error.error.message;
          this.getAllBill();
        }else{
          this.responseMessage = "Failed to delete the bill.";
        }
      } 
    )
  }

  downloadReportAction(bill:Bill){
    this.billService.getPdf(bill).subscribe(
      (response:any) => {
        saveAs(response, bill.uuid + '.pdf');
      }
    )
  }

}
