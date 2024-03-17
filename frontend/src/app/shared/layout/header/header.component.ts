import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { CategoryType } from 'src/types/category.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

   isLogged: boolean = false;
   @Input() categories: CategoryWithTypeType[] = [];
    count:number = 1 ;
  constructor(private authService : AuthService,  private _snackBar: MatSnackBar,
    private router: Router, private cartService: CartService) {
      this.isLogged = this.authService.getIsLoggedIn();

  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe( (isLoggedIn:boolean)=> {
      console.log(isLoggedIn)
        this.isLogged = isLoggedIn ;
     });

     this.cartService.getCartCount()
      .subscribe(data=> {
         this.count = data.count;
      })

      this.cartService.count$
       .subscribe(count=> {
          this.count = count;
       })
  }

  logout():void {
     this.authService.logout()
      .subscribe( {
        next: ()=> {
          this.doLogout()
        },
        error: ()=> {
            this.doLogout();
        }
       }
    )
  }
  doLogout():void {
    this.authService.removeTokens();
    this.authService.userId = null ;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
