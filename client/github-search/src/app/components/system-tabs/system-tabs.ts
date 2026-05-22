import { Component, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-system-tabs',
  imports: [MatTabsModule],
  templateUrl: './system-tabs.html',
  styleUrl: './system-tabs.css',
})
export class SystemTabs {
  selectedTabNameEmit = output<'hangar' | 'favorites'>();

  onIndexChange(index: number) {
    switch (index) {
      case 0:
        this.selectedTabNameEmit.emit('hangar');
        break;
      case 1:
        this.selectedTabNameEmit.emit('favorites');
        break;
      default:
        this.selectedTabNameEmit.emit('hangar');
        break;
    }
  }
}
