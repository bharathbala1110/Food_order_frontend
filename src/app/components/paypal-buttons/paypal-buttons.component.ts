import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/order';
declare var paypal:any;

@Component({
  selector: 'paypal-buttons',
  templateUrl: './paypal-buttons.component.html',
  styleUrls: ['./paypal-buttons.component.scss']
})
export class PaypalButtonsComponent implements OnInit {
 @Input() order!: Order; 
 @ViewChild('paypal', {static: true})
 paypalElement!:ElementRef;
  constructor(private orderService: OrderService,
    private cartService: CartService,
    private router:Router,) { }

  ngOnInit(): void {
    const self = this;
    paypal
    .Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'CAD',
                value: self.order.totalPrice,
              },
            },
          ],
        });
      },

      onApprove: async (data: any, actions: any) => {
        const payment = await actions.order.capture();
        this.order.paymentId = payment.id;
        self.orderService.pay(this.order).subscribe(
          {
            next: (orderId:any) => {
              this.cartService.clearCart();
              this.router.navigateByUrl('/track/' + orderId);
              // this.toastrService.success(
              //   'Payment Saved Successfully',
              //   'Success'
              // );
            },
            error: (error:any) => {
              // this.toastrService.error('Payment Save Failed', 'Error');
        console.log(error);
      }
          }
        );
      },

      onError: (err: any) => {
        // this.toastrService.error('Payment Failed', 'Error');
        console.log(err);
      },
    })
    .render(this.paypalElement.nativeElement);

  }

  }


