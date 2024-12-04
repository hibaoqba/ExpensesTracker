import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false; 

  constructor(private router: Router, private authService: AuthService) {}

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
  logout() {
    this.authService.logout(); 
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isOpen = false; 
  }
}
