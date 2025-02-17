export class Bill{
    id:number;
    name:string;
    paymentMethod:number;
    email:number;
    createdby:number;
    contactNumber:string;
    productDetail:any = [{
        category:null,
        categoryId:null,
        id:null,
        name:null,
        price:null,
        quantity:null,
        total:null
    }];
    total:number;
    uuid:string;
}