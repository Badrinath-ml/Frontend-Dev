// Week 13: Angular service + BehaviorSubject.
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FoodItem} from '../models/food';

@Injectable({providedIn:'root'})
export class FoodService {
  private readonly foodsSubject=new BehaviorSubject<FoodItem[]>([
    new FoodItem(1,'Chicken Biryani','Spice Garden','Biryani',240),
    new FoodItem(2,'Margherita Pizza','Pizza Zone','Pizza',299),
    new FoodItem(3,'Classic Burger','The Burger House','Burger',199),
    new FoodItem(4,'Masala Dosa','Dosa Corner','South Indian',149),
    new FoodItem(5,'Veg Hakka Noodles','Wok & Bowl','Asian',219),
    new FoodItem(6,'Chocolate Cake','Sweet Cravings','Dessert',179)
  ]);
  readonly foods$=this.foodsSubject.asObservable();
  addFood(food:FoodItem){this.foodsSubject.next([...this.foodsSubject.getValue(),food]);}
  removeFood(id:number){this.foodsSubject.next(this.foodsSubject.getValue().filter(food=>food.id!==id));}
}