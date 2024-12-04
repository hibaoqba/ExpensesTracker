import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5093/api/expenses';  // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  addExpense(expense: { description: string, amount: number }): Observable<any> {
    return this.http.post(this.apiUrl, expense);
  }

  // Method to get all expenses (if you want to display them later)
  getExpenses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}