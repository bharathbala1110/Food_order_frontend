import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  order:Order=new Order();

  checkoutForm!:FormGroup;
  constructor(cartService:CartService,private router:Router,
    private fb:FormBuilder,
    private userService:UserService,private orderService:OrderService
    ) { 
      const cart=cartService.getCart()
      this.order.items=cart.items,
      this.order.totalPrice=cart.totalPrice
      console.log("cart",cart)
      console.log("order",this.order)
    }

  ngOnInit(): void {
    let {name,address}=this.userService.currentUser
    this.checkoutForm=this.fb.group({
      name:[name,Validators.required],
      address:[address,Validators.required]
    })
  }
get f(){
  return this.checkoutForm.controls
}
createOrder(){
  if(this.checkoutForm.invalid) return;


  console.log(this.order)
if(!this.order.addressLatLng){
  alert("Please select location")
  return
}
this.order.name=this.f.name.value
this.order.address=this.f.address.value

this.orderService.create(this.order).subscribe(resp=>{
  this.router.navigateByUrl('/payment')
},
(err)=>{console.log(err)}
)
}
}
