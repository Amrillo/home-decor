import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  categories: CategoryType[] = [];

  ngOnInit(): void {
    this.categoryService.getCategories()
       .subscribe( (categories: CategoryType[])=> {
          this.categories = categories;
          console.log(this.categories);
        }
    )
  }

}
