// Week 13: Consume shared cart state from an Angular service.
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CartService} from '../../services/cart.service';

@Component({selector:'app-cart',imports:[CommonModule,RouterLink],templateUrl:'./cart.html',styleUrl:'./cart.css'})
export class Cart {
  readonly cart$=this.cartService.cart$;
  constructor(private readonly cartService:CartService){}
  remove(index:number){this.cartService.remove(index);}
  clear(){this.cartService.clear();}
  total(prices:number[]){return prices.reduce((sum,p)=>sum+p,0);}
}