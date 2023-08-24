import { Injectable } from '@angular/core';
import { User } from '../shared/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/models/constants/urls';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
const USER_KEY='User'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject=new BehaviorSubject<User>(this.getUserLocalStorage())
  public userObservable:Observable<User>;
  constructor(private http:HttpClient) { 
    this.userObservable=this.userSubject.asObservable()
  }
  public get currentUser():User{
  //  console.log("uservalue",this.userSubject.value)

   return this.userSubject.value
    }
  login(userLogin:IUserLogin):Observable<User>{
    console.log("test",this.http.post<User>(USER_LOGIN_URL,userLogin))
    return  this.http.post<User>(USER_LOGIN_URL,userLogin).pipe(
      tap({
        next:(user)=>{
          this.setUserLocalStorage(user)
          this.userSubject.next(user)
          
        },
        error:(errorResp)=>{
          console.log(errorResp)
        }
      })
    );

  }
register(user:IUserRegister):Observable<User>{
   return this.http.post<User>(USER_REGISTER_URL,user ).pipe(tap({
    next:(user)=>{
      this.setUserLocalStorage(user)
      this.userSubject.next(user)
    },
    error:(err)=>{
      console.log(err)
    }
   }))
}

  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload()
  }
  private setUserLocalStorage(user:User){
    localStorage.setItem(USER_KEY,JSON.stringify(user))
  }
  private getUserLocalStorage():User{
    const userJson=localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return  new User()
    
  }
}
