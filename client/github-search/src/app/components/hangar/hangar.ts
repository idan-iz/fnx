import { Component, inject } from '@angular/core';
import { SearchBar } from "../search-bar/search-bar";
import { ResultCard } from "../result-card/result-card";
import { User } from '../../services/user';
import { IResultCard } from '../result-card/result-card.interface';

@Component({
  selector: 'app-hangar',
  imports: [SearchBar, ResultCard],
  templateUrl: './hangar.html',
  styleUrl: './hangar.css',
})
export class Hangar {
  userService = inject(User);
  searchResult$ = this.userService.searchResult$;

  toggleFavorite(card: IResultCard) {
    if (this.userService.isBookmarked(card.id)) {
      this.userService.removeBookmark(card.id);
    } else {
      this.userService.addBookmark(card);
    }
  }
}
