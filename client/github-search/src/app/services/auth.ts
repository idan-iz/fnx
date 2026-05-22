import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILogin } from '../components/login/login.interface';
import { IRegister } from '../components/register/register.interface';
import { environment } from '../environment/environment';
import { General } from './general';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = environment.tokenKey;
  private token: string | null = null;

  private http = inject(HttpClient, { optional: true });
  private router = inject(Router, { optional: true });
  private readonly BASE_URL = environment.apiUrl;

  private generalService = inject(General);
  authLoading$ = this.generalService.loading$;

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

    if (this.generalService.loading$()) {
      return;
    }

    this.generalService.setLoading(true);

    this.http.post<{ token: string; username: string }>(`${this.BASE_URL}/auth/login`, payload)
      .subscribe({
        next: (response) => {
          this.setToken(response.token);
          this.generalService.setLoading(false);
          if (this.router) {
            this.router.navigate(['/system']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this.generalService.showError(err?.error?.message || 'Login failed. Please check your credentials.');
          this.generalService.setLoading(false);
        }
      });
  }

  register(payload: IRegister) {
    if (!this.http || this.generalService.loading$()) {
      return;
    }

    this.generalService.setLoading(true);

    const registerPayload = {
      username: payload.username,
      password: payload.password
    };

    this.http.post(`${this.BASE_URL}/auth/register`, registerPayload)
      .subscribe({
        next: () => {
          // Reset loading state so the next login() invocation is allowed
          this.generalService.setLoading(false);
          this.login({ username: payload.username, password: payload.password });
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.generalService.showError(err?.error?.message || 'Registration failed.');
          this.generalService.setLoading(false);
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
