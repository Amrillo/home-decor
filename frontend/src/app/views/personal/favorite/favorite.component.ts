import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  
  serverStaticPath = environment.serverStaticPath ;
  constructor(private favoriteService : FavoriteService) { }

  ngOnInit(): void {
      this.favoriteService.getFavorites()
        .subscribe((data: FavoriteType[] | DefaultResponseType)=> {  
           if((data as DefaultResponseType).error !== undefined) {  
              const error  = (data as DefaultResponseType).message; 
              throw new Error(error); 
           }       

           this.products = data as FavoriteType[];  
           console.log(this.products);
        })

  }

  removefromFavorites(id:string){  
      this.favoriteService.removeFavorites(id)
       .subscribe((data:DefaultResponseType)=> {  
          if(data.error){  
            throw new Error(data.message); 
          }
          this.products = this.products.filter(item=> item.id !== id);
       })
    }
}
