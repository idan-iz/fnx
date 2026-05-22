import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILogin } from '../components/login/login.interface';
import { IRegister } from '../components/register/register.interface';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = environment.tokenKey;
  private token: string | null = null;

  private http = inject(HttpClient, { optional: true });
  private router = inject(Router, { optional: true });
  private readonly BASE_URL = environment.apiUrl;

  private authLoading = signal<boolean>(false);
  authLoading$ = this.authLoading.asReadonly();

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
  }

  login(payload: ILogin) {
    if (!this.http) {
      console.warn('HttpClient is not available.');
      return;
    }

    if (this.authLoading()) {
      return;
    }

    this.authLoading.set(true);

    this.http.post<{ token: string; username: string }>(`${this.BASE_URL}/auth/login`, payload)
      .subscribe({
        next: (response) => {
          this.setToken(response.token);
          this.authLoading.set(false);
          if (this.router) {
            this.router.navigate(['/system']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          alert(err?.error?.message || 'Login failed. Please check your credentials.');
          this.authLoading.set(false);
        }
      });
  }

  register(payload: IRegister) {
    if (!this.http || this.authLoading()) {
      return;
    }

    this.authLoading.set(true);

    const registerPayload = {
      username: payload.username,
      password: payload.password
    };

    this.http.post(`${this.BASE_URL}/auth/register`, registerPayload)
      .subscribe({
        next: () => {
          // Reset loading state so the next login() invocation is allowed
          this.authLoading.set(false);
          this.login({ username: payload.username, password: payload.password });
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert(err?.error?.message || 'Registration failed.');
          this.authLoading.set(false);
        }
      });
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
    if (this.router) {
      this.router.navigate(['/']);
    }
  }
}
