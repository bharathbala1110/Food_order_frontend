import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  order:Order=new Order()
  constructor( orderService:OrderService, private router:Router) { 
    console.log("payment")
    orderService.getNewOrderForCurrentUser().subscribe(order=>{
      this.order=order
      // console.log("payment page order",this.order)
    },
    (err)=>{
      console.log(err)
      router.navigateByUrl('/check-out')
    },
    ()=>console.log("completed")  
    )
  }

  ngOnInit(): void {
  }

}
