import { Component, inject } from '@angular/core';
import { SearchBar } from "../search-bar/search-bar";
import { ResultCard } from "../result-card/result-card";
import { User } from '../../services/user';

@Component({
  selector: 'app-hangar',
  imports: [SearchBar, ResultCard],
  templateUrl: './hangar.html',
  styleUrl: './hangar.css',
})
export class Hangar {
  userService = inject(User);
  searchResult$ = this.userService.searchResult$;
}
