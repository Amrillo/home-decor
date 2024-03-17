import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductType } from 'src/types/product.type';
import { CartService } from '../../services/cart.service';
import { CartType } from 'src/types/cart.type';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType;
  serverStaticPath = environment.serverStaticPath ;
  count: number = 1 ;
  @Input() countInCart: number | undefined = 0 ;
  @Input() isLight: boolean = false;
  isInCart: boolean = false;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    if(this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart
    }

  }

  addToCart() {
     this.cartService.updateCart(this.product.id, this.count)
       .subscribe((data: CartType)=> {
          this.countInCart = this.count;
       })
  };

  updateCount(value:number) {
       this.count = value ;
       if(this.countInCart) {
          this.cartService.updateCart(this.product.id, this.count)
          .subscribe((data: CartType)=> {
            this.countInCart = this.count;
          })
       }
  };

    removeFromCart() {
      this.cartService.updateCart(this.product.id, 0)
       .subscribe((data: CartType)=> {
        this.countInCart = 0 ;
          this.count = 1 ;
       })
    }
}
