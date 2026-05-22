import { Injectable, signal } from '@angular/core';
import { IHangarResult } from '../components/hangar/hangar.interface';

@Injectable({
  providedIn: 'root',
})
export class User {

  private searchResult = signal<IHangarResult | null>(null);
  searchResult$ = this.searchResult.asReadonly();

  searchRepositories(query: string) {
    if (query.trim().length === 0) return;

  }
}
