// Week 14: Routed reactive feedback form.
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';

@Component({selector:'app-feedback',imports:[CommonModule,ReactiveFormsModule],templateUrl:'./feedback.html',styleUrl:'./feedback.css'})
export class Feedback {
  submitted=false;
  readonly form=new FormGroup({name:new FormControl('',{nonNullable:true,validators:[Validators.required]}),message:new FormControl('',{nonNullable:true,validators:[Validators.required,Validators.minLength(5)]})});
  submit(){this.submitted=true;if(this.form.invalid)return;console.log('FoodEX feedback:',this.form.getRawValue());}
}