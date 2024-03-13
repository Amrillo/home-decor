import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CategoryType } from 'src/types/category.type';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  categories: CategoryWithTypeType[] = [];

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
       .subscribe( (categories: CategoryWithTypeType[])=> {
          this.categories = categories.map(item=>{  
            return Object.assign({typesUrl: item.types.map(item=> item.url)}, item);   
          })

          console.log(this.categories);
                        
        }
    )
  }

}
