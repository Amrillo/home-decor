import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductType } from 'src/types/product.type';
import { CartService } from '../../services/cart.service';
import { CartType } from 'src/types/cart.type';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { FavoriteType } from 'src/types/favorite.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private cartService: CartService, private authService : AuthService,
    private favoriteService: FavoriteService, private _snackBar: MatSnackBar) { }

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

    updateFavorite() {
      if(!this.authService.getIsLoggedIn()) {
        this._snackBar.open('Для добавления в избранное необходимо авторизоваться')
        return ;
     };

     if(this.product.isInFavorite) {
       this.favoriteService.removeFavorites(this.product.id)
       .subscribe((data:DefaultResponseType)=> {
          if(data.error){
            throw new Error(data.message);
          }
           this.product.isInFavorite = false;
       })
     } else {
       this.favoriteService.addFavorites(this.product.id)
       .subscribe((data: FavoriteType[] | DefaultResponseType)=> {
         if((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
        }
          this.product.isInFavorite = true ;
      })
    }
  }
}
