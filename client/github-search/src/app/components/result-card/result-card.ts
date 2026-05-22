import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { IResultCard } from './result-card.interface';

@Component({
  selector: 'app-result-card',
  imports: [MatIcon, DecimalPipe],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard {
  card = input<IResultCard>();
  isFavorite = input<boolean>(false);
  favoriteEmit = output<IResultCard>();

  onFavoriteClick() {
    if (this.card()?.id) {
      this.favoriteEmit.emit(this.card()!);
    }
  }
}

