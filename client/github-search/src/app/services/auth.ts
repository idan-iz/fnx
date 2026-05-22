import { Injectable } from '@angular/core';
import { ILogin } from '../components/login/login.interface';
import { IRegister } from '../components/register/register.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
  }

  login(payload: ILogin) {
    console.log(payload);
  }

  register(payload: IRegister) {
    console.log(payload);
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.removeToken();
  }
}
