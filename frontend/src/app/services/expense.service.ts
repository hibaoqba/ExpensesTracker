import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5093/api/expense';  

  constructor(private http: HttpClient, private authService: AuthService) {}

  addExpense(expense: { description: string, amount: number }): Observable<any> {
    const token = this.authService.getToken();  
    return this.http.post(this.apiUrl, expense, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getExpenses(): Observable<any> {
    const token = this.authService.getToken();  
    return this.http.get(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
  }
  deleteExpense(id: number): Observable<any> {
    const token = this.authService.getToken();  
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  getMonthlyExpenseTotals(): Observable<any> {
    const token = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/monthly-totals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
