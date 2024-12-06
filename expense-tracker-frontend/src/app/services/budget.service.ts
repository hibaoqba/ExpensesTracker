import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://localhost:5093/api/budget'; // Replace with your API base URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Assume this retrieves the JWT token
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getCurrentBudget(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`, {
      headers: this.getAuthHeaders(),
    });
  }

  setBudget(budgetData: { monthlyBudget: number; month: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, budgetData, {
      headers: this.getAuthHeaders(),
    });
  }

  checkBudgetStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`, {
      headers: this.getAuthHeaders(),
    });
  }

  getLast12MonthsBudgets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/last-12-months`, {
      headers: this.getAuthHeaders(),
    });
  }
}
