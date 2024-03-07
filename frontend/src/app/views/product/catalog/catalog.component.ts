import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];
  activeParams:ActiveParamsType = {types: []}; 

  categoriesWithTypes: CategoryWithTypeType[] = [];
  

  constructor(private productService: ProductService , private categorySerice : CategoryService,  
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

   this.activatedRoute.queryParams.subscribe(params=> {  
      this.activeParams = ActiveParamsUtil.processParams(params);
      
   })

     this.productService.getProducts()
       .subscribe( data=> {
          this.products = data.items ;
       });

       this.categorySerice.getCategoriesWithTypes()
         .subscribe( data=> {
            console.log(data);
            this.categoriesWithTypes = data ;
         });

      
      }

    
}
