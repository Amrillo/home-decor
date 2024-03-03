import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { ProductType } from 'src/types/product.type';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];

  categoriesWithTypes: CategoryWithTypeType[] = [];

  constructor(private productService: ProductService , private categorySerice : CategoryService) { }

  ngOnInit(): void {
     this.productService.getProducts()
       .subscribe( data=> {
          this.products = data.items ;
       });

       this.categorySerice.getCategoriesWithTypes()
         .subscribe( data=> {
            console.log(data);
            this.categoriesWithTypes = data ;
         })
      }
}
