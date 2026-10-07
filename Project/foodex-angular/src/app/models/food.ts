// Week 11: TypeScript interfaces, classes and functions.
export interface IFoodItem {
  id:number; name:string; restaurant:string; category:string; price:number;
  getSummary():string;
}
export class FoodItem implements IFoodItem {
  constructor(public id:number,public name:string,public restaurant:string,public category:string,public price:number){}
  getSummary():string { return `${this.name} from ${this.restaurant} - ₹${this.price}`; }
}
export function applyDiscount(food:FoodItem,percent:number):number {
  return food.price-(food.price*percent)/100;
}