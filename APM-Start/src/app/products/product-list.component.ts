import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    get listFilter(): string {
      return this._listFilter;
    }
    set listFilter(value: string){
      this._listFilter = value
      this.filteredProducts = this.performFilter(value);
    }

    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string = ''
    sub!: Subscription;
    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];
    
    private _listFilter: string = '';
    
    constructor(private productService: ProductService){}

    ngOnInit(): void {
      this.sub = this.productService.getProducts().subscribe({
        next: products => {
          this.products = products;
          this.filteredProducts = this.products;
        },
        error: err => this.errorMessage = err
      });
    }

    ngOnDestroy(): void {
      this.sub.unsubscribe();
    }

    performFilter(filterBy: string): IProduct[]{
      filterBy = filterBy.toLocaleLowerCase();
      return this.products.filter((product: IProduct) => 
      product.productName.toLocaleLowerCase().includes(filterBy));
    }

    toggleImage(): void{
      this.showImage = !this.showImage
    }

    onRatingClicked(message: string): void {
      this.pageTitle = 'Product List: ' + message
    }
}