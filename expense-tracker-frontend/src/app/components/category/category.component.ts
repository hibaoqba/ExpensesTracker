import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common'; // Use CommonModule, NOT BrowserModule
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  standalone: true,
  imports: [NgxChartsModule, CommonModule] 
})
export class CategoryComponent implements OnInit {
  categoryData: any[] = [];
  view: [number, number] = [700, 400];
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = true;
  legendPosition = 'below';
  colorScheme = {
    domain: ['#ff6347', '#4682b4', '#ffd700', '#32cd32', '#9370db'] // Custom colors
  };
  
  apiUrl = 'http://localhost:5093/api/expense/totals-by-category'; 

  constructor(private http: HttpClient, private authService:AuthService) {}

  ngOnInit(): void {
    this.getCategoryData();
  }

  getCategoryData(): void {
    const token = this.authService.getToken(); 
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      this.http.get<{ category: string; total: number }[]>(this.apiUrl, { headers }).subscribe({
        next: (data) => this.formatDataForChart(data),
        error: (err) => {
          console.error('Error fetching category data:', err);
          if (err.status === 401) {
            alert('Authentication failed. Please log in again.');
          } else if (err.status === 500) {
            alert('Server error. Please try again later.');
          } else {
            alert('An error occurred. Please check your connection or try again.');
          }
        }
      });
    } else {
      alert('You are not authenticated. Please log in.');
    }
  }
  

  formatDataForChart(data: { category: string; total: number }[]): void {
    this.categoryData = data.map(item => ({
      name: item.category,
      value: item.total
    }));
  }
}
