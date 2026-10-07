// Week 14: Root Angular component.
import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {CartService} from './services/cart.service';

@Component({selector:'app-root',imports:[RouterOutlet,RouterLink,RouterLinkActive,AsyncPipe],templateUrl:'./app.html',styleUrl:'./app.css'})
export class App {
 readonly cart$=this.cartService.cart$;
 constructor(private readonly cartService:CartService){}
}