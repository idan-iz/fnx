import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IHangarResult } from '../components/hangar/hangar.interface';
import { IResultCard } from '../components/result-card/result-card.interface';
import { environment } from '../environment/environment';
import { General } from './general';

@Injectable({
  providedIn: 'root',
})
export class User {
  private http = inject(HttpClient, { optional: true });
  private readonly BASE_URL = environment.apiUrl;

  private generalService = inject(General);

  private searchResult = signal<IHangarResult | null>(null);
  searchResult$ = this.searchResult.asReadonly();

  searchLoading$ = this.generalService.loading$;

  private bookmarks = signal<IResultCard[]>([]);
  bookmarks$ = this.bookmarks.asReadonly();

  constructor() {
    this.loadBookmarks();
  }

  searchRepositories(query: string) {
    if (query.trim().length === 0 || !this.http || this.generalService.loading$()) return;

    this.generalService.setLoading(true);

    this.http.post<IHangarResult>(`${this.BASE_URL}/github/search`, { query })
      .subscribe({
        next: (res) => {
          this.searchResult.set(res);
          this.generalService.setLoading(false);
        },
        error: (err) => {
          console.error('Search failed', err);
          this.generalService.showError(err?.error?.message || 'Search failed. Please try again.');
          this.searchResult.set({ total_count: 0, incomplete_results: false, items: [] });
          this.generalService.setLoading(false);
        }
      });
  }

  loadBookmarks() {
    if (!this.http) return;

    this.http.get<IResultCard[]>(`${this.BASE_URL}/bookmarks`)
      .subscribe({
        next: (list) => {
          this.bookmarks.set(list);
        },
        error: (err) => {
          console.error('Failed to load bookmarks', err);
          this.generalService.showError(err?.error?.message || 'Failed to load bookmarks.');
        }
      });
  }

  addBookmark(card: IResultCard) {
    if (!this.http) return;

    this.http.post<IResultCard>(`${this.BASE_URL}/bookmarks`, card)
      .subscribe({
        next: (newBookmark) => {
          this.bookmarks.update(list => [...list, newBookmark]);
        },
        error: (err) => {
          console.error('Failed to add bookmark', err);
          this.generalService.showError(err?.error?.message || 'Failed to add bookmark.');
        }
      });
  }

  removeBookmark(repoId: number) {
    if (!this.http) return;

    this.http.delete(`${this.BASE_URL}/bookmarks/${repoId}`)
      .subscribe({
        next: () => {
          this.bookmarks.update(list => list.filter(b => b.id !== repoId));
        },
        error: (err) => {
          console.error('Failed to remove bookmark', err);
          this.generalService.showError(err?.error?.message || 'Failed to remove bookmark.');
        }
      });
  }

  isBookmarked(repoId: number): boolean {
    return this.bookmarks().some(b => b.id === repoId);
  }
}
