import { Component, inject } from '@angular/core';
import { General } from '../../services/general';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  generalService = inject(General);
}
