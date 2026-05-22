import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../services/user';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, MatInput, MatFormField, MatLabel, MatIcon],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  fb = inject(FormBuilder);
  userService = inject(User)
  searchForm = this.fb.group({
    query: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
  })

  onClickSearch() {
    if (this.searchForm.invalid) return;
    this.userService.searchRepositories(this.searchForm.value.query || '');
  }
}
