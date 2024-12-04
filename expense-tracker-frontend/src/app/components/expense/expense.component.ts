import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // For API calls

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Ensure HttpClientModule is included
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  newExpense = { description: '', amount: null, category: '', date: '' }; // Model for adding a new expense
  expenses: { id: number; description: string; amount: number; category: string; date: string }[] = []; // Array for fetched expenses
  private apiUrl = 'http://localhost:5093/api/expense'; // Update this with your API endpoint

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getExpenses();
  }

  getExpenses(): void {
    this.http.get<{ id: number; description: string; amount: number; category: string; date: string }[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.expenses = data;
        },
        error: (err) => {
          console.error('Error fetching expenses:', err);
        },
      });
  }

  addExpense(form: any): void {
    if (form.valid) {
      this.http.post<{ id: number; description: string; amount: number; category: string; date: string }>(this.apiUrl, this.newExpense)
        .subscribe({
          next: (createdExpense) => {
            this.expenses.push(createdExpense); // Add to the list of expenses
            this.newExpense = { description: '', amount: null, category: '', date: '' }; // Reset form model
            form.resetForm(); // Reset the form after submission
          },
          error: (err) => {
            console.error('Error adding expense:', err);
          },
        });
    }
  }
}
