import { Component, input, output, inject, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { IResultCard } from './result-card.interface';
import { User } from '../../services/user';

@Component({
  selector: 'app-result-card',
  imports: [MatIcon, DecimalPipe],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard {
  userService = inject(User);

  card = input<IResultCard>();
  
  isFavorite = computed(() => {
    const cardId = this.card()?.id;
    return cardId ? this.userService.isBookmarked(cardId) : false;
  });

  favoriteEmit = output<IResultCard>();

  onFavoriteClick() {
    if (this.card()?.id) {
      this.favoriteEmit.emit(this.card()!);
    }
  }
}

