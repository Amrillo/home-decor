import { Component, Input, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { ActiveParamsType } from 'src/types/active-params.type';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {


  @Input() categoryWithTypes: CategoryWithTypeType | null = null ;
  @Input() type: string | null = null ;  
  activeParamas:ActiveParamsType = {types: []}; 
  from: number | null = null ; 
  to: number | null = null ; 
  open:boolean = false ;  

  get title():string {  
    if(this.categoryWithTypes) {  
       return this.categoryWithTypes.name
    } else if (this.type) {  
      if(this.type === 'height'){  
        return 'Высота';
      } else if (this.type === 'diameter') {  
        return 'Диаметр';
      }
    }
    return ''; 
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toggle():void {  
     this.open = !this.open; 
  }

  updateFilterParam(url:string, checked: boolean):void {  

    if(this.activeParamas.types && this.activeParamas.types.length > 0) {  
        const existingTypeInParams =  this.activeParamas.types.find(item=> item === url);  
        if(existingTypeInParams && !checked) {  
          this.activeParamas.types = this.activeParamas.types.filter(item=> item !== url); 
        } else if (!existingTypeInParams && checked) {  
          this.activeParamas.types.push(url);
        }
    } else if (checked) {  
       this.activeParamas.types = [url];
    }

    this.router.navigate(['/catalog'], { 
      queryParams: this.activeParamas
    })
  }

  updateFilterParamFromTo() {  
      
  }
}
