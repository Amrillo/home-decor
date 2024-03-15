import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartType } from 'src/types/cart.type';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    constructor(private http :HttpClient) { }

    getCart():Observable<CartType> {
      return this.http.get<CartType>(environment.api + 'cart');
    }
}
