import { Component, inject } from '@angular/core';
import { ResultCard } from '../result-card/result-card';
import { User } from '../../services/user';
import { IResultCard } from '../result-card/result-card.interface';

@Component({
  selector: 'app-favorites',
  imports: [ResultCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  userService = inject(User);
  bookmarks$ = this.userService.bookmarks$;

  removeFavorite(card: IResultCard) {
    this.userService.removeBookmark(card.id);
  }
}
