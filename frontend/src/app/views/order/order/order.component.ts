import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { DeliveryType } from 'src/types/delivery.type';
import { OrderType } from 'src/types/order.type';
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
  } )

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null ;
  constructor(private cartService : CartService, private router : Router,  private _snackBar: MatSnackBar,
    private fb: FormBuilder, private dialog: MatDialog, private orderService: OrderService) { }

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

     if(this.orderForm.valid && this.orderForm.value.firstName && this.orderForm.value.lastName && this.orderForm.value.phone,
      this.orderForm.value.paymentType && this.orderForm.value.email) {

      const paramsObject : OrderType = {
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName,
        lastName: this.orderForm.value.lastName,
        phone: this.orderForm.value.phone,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email,
      };

      this.orderService.createOrder(paramsObject)
      .subscribe( {
        next:(data: OrderType | DefaultResponseType)=> {
            if((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.dialogRef =  this.dialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe( ()=> {
               this.router.navigate(['/']);
               }
             );
        },
        error: (errorResponse: HttpErrorResponse)=> {
            if(errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Oshibka zakaza');
            }
        }
       }
      )
     }
   }

   closePopup() {
      this.dialogRef?.close();
      this.router.navigate(['/']);
   }
}
