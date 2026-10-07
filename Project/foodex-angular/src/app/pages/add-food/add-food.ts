// Week 14: Angular Reactive Forms, validation and routing.
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import {Router,RouterLink} from '@angular/router';
import {FoodItem} from '../../models/food';
import {FoodService} from '../../services/food.service';

@Component({selector:'app-add-food',imports:[CommonModule,ReactiveFormsModule,RouterLink],templateUrl:'./add-food.html',styleUrl:'./add-food.css'})
export class AddFood {
  private nextId=100; submitted=false;
  readonly foodForm=new FormGroup({
    name:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.minLength(2)]}),
    restaurant:new FormControl('',{nonNullable:true,validators:[Validators.required]}),
    category:new FormControl('',{nonNullable:true,validators:[Validators.required]}),
    price:new FormControl(0,{nonNullable:true,validators:[Validators.required,Validators.min(1)]})
  });
  constructor(private readonly foodService:FoodService,private readonly router:Router){}
  submit(){this.submitted=true;if(this.foodForm.invalid)return;const v=this.foodForm.getRawValue();this.foodService.addFood(new FoodItem(this.nextId++,v.name.trim(),v.restaurant.trim(),v.category.trim(),v.price));this.router.navigate(['/foods']);}
}