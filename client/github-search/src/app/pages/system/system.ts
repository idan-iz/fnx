import { Component } from '@angular/core';
import { SystemTabs } from "../../components/system-tabs/system-tabs";
import { Hangar } from "../../components/hangar/hangar";
import { Favorites } from "../../components/favorites/favorites";

@Component({
  selector: 'app-system',
  imports: [SystemTabs, Hangar, Favorites],
  templateUrl: './system.html',
  styleUrl: './system.css',
})
export class System {
  selectedTab: 'hangar' | 'favorites' = 'hangar';

  onTabChange(tab: 'hangar' | 'favorites') {
    this.selectedTab = tab;
  }
}
