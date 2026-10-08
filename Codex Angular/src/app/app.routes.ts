// Week 14: Angular routing.
import {Routes} from '@angular/router';
import {FoodList} from './pages/food-list/food-list';
import {AddFood} from './pages/add-food/add-food';
import {Cart} from './pages/cart/cart';
import {Feedback} from './pages/feedback/feedback';
export const routes:Routes=[
 {path:'foods',component:FoodList},{path:'add-food',component:AddFood},
 {path:'cart',component:Cart},{path:'feedback',component:Feedback},
 {path:'',pathMatch:'full',redirectTo:'foods'},{path:'**',redirectTo:'foods'}
];