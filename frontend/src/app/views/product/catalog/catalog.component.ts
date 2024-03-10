import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { AppliedFilterType } from 'src/types/applied-filters.type';
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
  appliedFilters: AppliedFilterType[]= [];
  sortingOpen = false ;

    sortingOptions: {name: string, value:  string}[] =[
      {name: 'От А до Я', value: 'az-asz'},
      {name: 'От Я до А', value: 'az-desc'},
      {name: 'По возрастанию цены', value: 'price-asc'},
      {name: 'По убыванию цены', value: 'price-desc'}
    ]
  pages: number[] = [];

  constructor(private productService: ProductService , private categorySerice : CategoryService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.categorySerice.getCategoriesWithTypes()
      .subscribe( data=> {
        console.log(data);
        this.categoriesWithTypes = data ;

        this.activatedRoute.queryParams.subscribe(params=> {
          this.activeParams = ActiveParamsUtil.processParams(params);

          this.appliedFilters = [];

          this.activeParams.types?.forEach(url => {
             for(let i =0 ; i < this.categoriesWithTypes.length; i++) {
                const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
                if(foundType) {
                  this.appliedFilters.push({
                    name: foundType.name,
                    urlParam: foundType.url
                  })
                }
             }
          });

          if(this.activeParams.heightFrom) {
            this.appliedFilters.push({
              name: 'Высота: от ' + this.activeParams.heightFrom + ' cm',
              urlParam: 'heightFrom'
            })
          }
          if(this.activeParams.heightTo) {
            this.appliedFilters.push({
              name: 'Высота: до ' + this.activeParams.heightTo + ' cm',
              urlParam: 'heightTo'
            })
          }
          if(this.activeParams.diameterFrom) {
            this.appliedFilters.push({
              name: 'Высота: от ' + this.activeParams.diameterFrom + ' cm',
              urlParam: 'diameterFrom'
            })
          }
          if(this.activeParams.diameterTo) {
            this.appliedFilters.push({
              name: 'Высота: до ' + this.activeParams.diameterTo + ' cm',
              urlParam: 'diameterTo'
            })
          }
       })
    });


    this.productService.getProducts()
        .subscribe( data=> {
          this.pages=[];
          for(let i = 1 ; i <= data.pages ; i++) {
            this.pages.push(i);
          }

          this.products = data.items ;

        });
     }

    removeAplliedFilter(appliedFilter: AppliedFilterType) {
        if(appliedFilter.urlParam === 'heightFrom' || appliedFilter.urlParam === 'heightTo' ||
              appliedFilter.urlParam === 'diameterFrom' || appliedFilter.urlParam === 'diameterTo'
        ) {
          delete this.activeParams[appliedFilter.urlParam];
        } else {
          if(this.activeParams.types) {
              this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam);
          }

          this.router.navigate(['/catalog'], {
              queryParams: this.activeParams
          })
        }
    }


    toggleSorting():void {
        this.sortingOpen = !this.sortingOpen;
    }

    sort(value: string) {
        this.activeParams.sort = value;

        this.router.navigate(['/catalog'], {
          queryParams: this.activeParams
        })
    }

    openPage(page:number) {

       this.activeParams.page = page;

       this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
     })

    }

    openNextPage() {
       if(this.activeParams.page && this.activeParams.page < this.pages.length) {
          this.activeParams.page++;
          this.router.navigate(['/catalog'], {
            queryParams: this.activeParams
         })
       }
    }

    openPrevPage() {
      if(this.activeParams.page && this.activeParams.page > 1) {
        this.activeParams.page--;
        this.router.navigate(['/catalog'], {
          queryParams: this.activeParams
       })
     }
    }

}
