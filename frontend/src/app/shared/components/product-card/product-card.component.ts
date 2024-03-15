import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductType; 
  serverStaticPath = environment.serverStaticPath ;  
  count: number = 1 ; 

  @Input() isLight: boolean = false;  
  
  constructor() { }

  ngOnInit(): void {
  }

}
