import { Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { ActiveParamsType } from 'src/types/active-params.type';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { ActiveParamsUtil } from '../../utils/active-params.util';

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

  constructor(private router: Router , private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // добавит каждую значению в query parametr url  
    this.activatedRoute.queryParams.subscribe(params=> {  
      
      this.activeParamas = ActiveParamsUtil.processParams(params); 

      // открыт каждый элемент филтеров которые уже чекнули   
      if(this.type) {  

        if(this.type === 'height') {  
          this.open = !!(this.activeParamas.heightFrom || this.activeParamas.heightTo);
          this.from = this.activeParamas.heightFrom ?  +this.activeParamas.heightFrom : null ; 
          this.to = this.activeParamas.heightTo ? + this.activeParamas.heightTo : null ; 
        
        } else if(this.type === 'diameter') {  
          this.open = !!(this.activeParamas.diameterFrom || this.activeParamas.diameterTo);
          this.from = this.activeParamas.diameterFrom ?  +this.activeParamas.diameterFrom : null ; 
          this.to = this.activeParamas.diameterTo ? + this.activeParamas.diameterTo : null ; 
        }
      } else {  
        this.activeParamas.types = params['types'];
      
        if(this.categoryWithTypes && this.categoryWithTypes.types && this.categoryWithTypes.types.length > 0 &&  
          this.categoryWithTypes.types.some(type=>this.activeParamas.types.find(item=> type.url === item)) && this.activeParamas.types.length > 0) {  
           this.open = true ; 
        }
      }
    })
  }

  toggle():void {  
     this.open = !this.open; 
  }

  updateFilterParam(url:string, checked: boolean):void {  

    if(this.activeParamas.types && this.activeParamas.types.length > 0) {   
        const existingTypeInParams = this.activeParamas.types.find(item=> item === url);  
        if(existingTypeInParams && !checked) {  
          this.activeParamas.types = this.activeParamas.types.filter(item=> item !== url); 
        } else if (!existingTypeInParams && checked) {  
          // this.activeParamas.types.push(url);   Это баг ангулар 
          this.activeParamas.types = [...this.activeParamas.types, url];
        }
    } else if (checked) {  
       this.activeParamas.types = [url];
    }

    this.router.navigate(['/catalog'], { 
       queryParams: this.activeParamas
    })
  }

  updateFilterParamFromTo(param: string,value: string ) {  
    if(param === 'heightTo' || param === 'heightFrom' || param === 'diameterTo' || param === 'diameterFrom') {  
      if(this.activeParamas[param] && !value) {  
        delete this.activeParamas[param];  
     } else {  
         this.activeParamas[param] = value ; 
     }

     this.router.navigate(['/catalog'], { 
      queryParams: this.activeParamas
     })
    }
  }
}
