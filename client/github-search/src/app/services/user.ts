import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IHangarResult } from '../components/hangar/hangar.interface';
import { IResultCard } from '../components/result-card/result-card.interface';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class User {
  private http = inject(HttpClient, { optional: true });
  private readonly BASE_URL = environment.apiUrl;

  private searchResult = signal<IHangarResult | null>(null);
  searchResult$ = this.searchResult.asReadonly();

  private searchLoading = signal<boolean>(false);
  searchLoading$ = this.searchLoading.asReadonly();

  private bookmarks = signal<IResultCard[]>([]);
  bookmarks$ = this.bookmarks.asReadonly();

  constructor() {
    this.loadBookmarks();
  }

  searchRepositories(query: string) {
    if (query.trim().length === 0 || !this.http || this.searchLoading()) return;

    this.searchLoading.set(true);

    this.http.post<IHangarResult>(`${this.BASE_URL}/github/search`, { query })
      .subscribe({
        next: (res) => {
          this.searchResult.set(res);
          this.searchLoading.set(false);
        },
        error: (err) => {
          console.error('Search failed', err);
          this.searchResult.set({ total_count: 0, incomplete_results: false, items: [] });
          this.searchLoading.set(false);
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
        }
      });
  }

  isBookmarked(repoId: number): boolean {
    return this.bookmarks().some(b => b.id === repoId);
  }
}
