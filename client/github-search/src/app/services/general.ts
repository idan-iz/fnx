import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class General {
  private loading = signal<boolean>(false);
  loading$ = this.loading.asReadonly();

  private error = signal<string | null>(null);
  error$ = this.error.asReadonly();

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  showError(message: string) {
    this.error.set(message);
  }

  clearError() {
    this.error.set(null);
  }
}
