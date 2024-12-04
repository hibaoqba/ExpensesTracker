import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false; 

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isOpen = false; 
  }
}
