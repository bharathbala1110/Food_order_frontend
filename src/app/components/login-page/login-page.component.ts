import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm!:FormGroup;
  isSubmitted=false;
  returnUrl:any="1";
  constructor(
    private fb:FormBuilder,
    private userService:UserService,
    private activatedRoute:ActivatedRoute,
    private router:Router
    ) 
    {    }


  ngOnInit(): void {

    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    })
    this.returnUrl=this.activatedRoute.snapshot.queryParams.returnUrl;
    console.log("returnurl",this.returnUrl)
  }
get f(){
  return this.loginForm.controls;
}
submit(){
  this.isSubmitted=true;
  if(this.loginForm.invalid) return;
   this.userService.login({email:this.loginForm.value.email,password:this.loginForm.value.password}).subscribe(res=>{
    console.log("res",res )
    this.router.navigateByUrl(this.returnUrl)

   })
  // console.log(`Submit :${this.userService.login({email:this.loginForm.value.email,password:this.loginForm.value.password})}`)
  // console.log(`email :${this.loginForm.value.password}`)
}

}
