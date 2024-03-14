import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from 'src/environments/environment';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  recommendedProducts: ProductType[] = []
  product!: ProductType ;  
  serverStaticPath = environment.serverStaticPath ;  

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    }
  }
  constructor(private productService: ProductService, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {

      this.activatedRoute.params.subscribe(params=> {  
        this.productService.getProduct(params['url'])
        .subscribe((data:ProductType)=> {   
          this.product = data; 
        })
      })

      this.productService.getBestProducts()
      .subscribe((data:ProductType[])=> {
        this.recommendedProducts = data
      })
  }

  updateCount(value:number) {  
    console.log(value);
  }
}
