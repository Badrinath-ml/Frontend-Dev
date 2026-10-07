// Week 12: Angular component, data binding and directives.
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FoodItem} from '../../models/food';
import {FoodService} from '../../services/food.service';
import {CartService} from '../../services/cart.service';

@Component({selector:'app-food-list',imports:[CommonModule,FormsModule],templateUrl:'./food-list.html',styleUrl:'./food-list.css'})
export class FoodList {
  searchText=''; readonly foods$=this.foodService.foods$;
  constructor(private readonly foodService:FoodService,private readonly cartService:CartService){}
  addToCart(food:FoodItem){this.cartService.add(food);}
  removeFood(id:number){this.foodService.removeFood(id);}
  filteredFoods(foods:FoodItem[]){const q=this.searchText.trim().toLowerCase();return q?foods.filter(f=>`${f.name} ${f.restaurant} ${f.category}`.toLowerCase().includes(q)):foods;}
}