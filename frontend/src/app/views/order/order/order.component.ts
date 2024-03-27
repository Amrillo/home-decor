import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { DeliveryType } from 'src/types/delivery.type';
import { PaymentType } from 'src/types/payment.type';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  deliveryType: DeliveryType = DeliveryType.delivery;  
  deliveryTypes = DeliveryType ;  
  paymentTypes = PaymentType ; 
  cart: CartType | null = null ; 
  totalAmount:number = 0;
  totalCount: number = 0;

  orderForm = this.fb.group( { 
    firstName: ['',Validators.required],  
    lastName:['',Validators.required],
    phone: ['',Validators.required],
    fatherName: [''],
    paymentType: [PaymentType.cashToCourier, Validators.required],
    email: ['',[Validators.required, Validators.email]],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: [''],
    comment: [''],
  } 

  )
  constructor(private cartService : CartService, private router : Router,  private _snackBar: MatSnackBar,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.cartService.getCart()
    .subscribe((data:CartType | DefaultResponseType)=> {
      if((data as DefaultResponseType).error !== undefined) {  
        throw new Error((data as DefaultResponseType).message);
      }
      this.cart = data as CartType ;
      if(!this.cart || (this.cart && this.cart.items.length === 0)) {  
          this._snackBar.open('Корзина пустая')
          this.router.navigate(['/'])
         return 
      }
      this.calculateTotal();
    })
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    if(this.cart) {
      this.cart?.items.forEach(item=> {
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount += item.quantity;
      })
    }
  }

  changeDeliveryType(type: DeliveryType) {  
      this.deliveryType = type ; 
   }

   createOrder(){  
     if(this.orderForm.valid) { 
      console.log(this.orderForm.value);
     }
   }
}
