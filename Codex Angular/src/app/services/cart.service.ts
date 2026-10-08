// Week 13-14: Shared cart state with BehaviorSubject + localStorage.
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FoodItem} from '../models/food';

@Injectable({providedIn:'root'})
export class CartService {
  private readonly key='foodexAngularCart';
  private readonly subject=new BehaviorSubject<FoodItem[]>(this.load());
  readonly cart$=this.subject.asObservable();
  add(food:FoodItem){this.save([...this.subject.getValue(),food]);}
  remove(index:number){this.save(this.subject.getValue().filter((_,i)=>i!==index));}
  clear(){this.save([]);}
  private load():FoodItem[]{try{const v=JSON.parse(localStorage.getItem(this.key)??'[]') as FoodItem[];return Array.isArray(v)?v:[];}catch{return [];}}
  private save(cart:FoodItem[]){localStorage.setItem(this.key,JSON.stringify(cart));this.subject.next(cart);}
}