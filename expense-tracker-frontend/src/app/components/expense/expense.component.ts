import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // For API calls
import { AuthService } from '../../services/auth.service'; // Assuming you have an AuthService to get the current user

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  newExpense = { description: '', amount: null, category: '', date: '' }; 
  expenses: { id: number; description: string; amount: number; category: string; date: string }[] = []; // Array for fetched expenses
  private apiUrl = 'http://localhost:5093/api/expense'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getExpenses();
  }

  getExpenses(): void {
    const token = this.authService.getToken();  
    if (token) {
      this.http.get<{ id: number; description: string; amount: number; category: string; date: string }[]>(`${this.apiUrl}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (data) => {
          this.expenses = data;
        },
        error: (err) => {
          console.error('Error fetching expenses:', err);
        },
      });
    } else {
      console.error('User is not authenticated');
    }
  }


  addExpense(form: any): void {
    if (form.valid) {
      const token = this.authService.getToken();  
      if (token) {
        this.http.post<{ id: number; description: string; amount: number; category: string; date: string }>(this.apiUrl, this.newExpense, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (createdExpense) => {
            this.expenses.push(createdExpense); 
            this.newExpense = { description: '', amount: null, category: '', date: '' }; 
            form.resetForm(); 
          },
          error: (err) => {
            console.error('Error adding expense:', err);
          },
        });
      } else {
        console.error('User is not authenticated');
      }
    }
  }
}
