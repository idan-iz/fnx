import { Injectable } from '@angular/core';
import { ILogin } from '../components/login/login.interface';
import { IRegister } from '../components/register/register.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth {



  login(payload: ILogin) {
    console.log(payload);
  }

  register(payload: IRegister) {
    console.log(payload);
  }
}
