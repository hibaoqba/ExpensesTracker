import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { AuthService } from '../../services/auth.service'; 
import { ExpenseService } from '../../services/expense.service';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { BudgetService } from '../../services/budget.service';
@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressBarModule], 
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  newExpense = { description: '', amount: null, category: '', date: '' };
  expenses: { id: number; description: string; amount: number; category: string; date: string }[] = []; // Array for fetched expenses
  private apiUrl = 'http://localhost:5093/api/expense';

  totalForCurrentMonth: number = 0;
  totalBudget: number = 0; 
  progress: number = 0;
  budgetStatusMessage: string = '';
  isOverBudget: boolean = false;
  constructor(private http: HttpClient, private authService: AuthService, private expenseService: ExpenseService, private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.getExpenses();
    this.getExpenseTotals();
    this.getCurrentBudget();
    
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
            this.getExpenseTotals(); 
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

  deleteExpense(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.expenses = this.expenses.filter(exp => exp.id !== id); 
          console.log('Expense deleted successfully');
          this.getExpenseTotals(); 
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
        },
      });
    }
  }

  getExpenseTotals(): void {
    const token = this.authService.getToken();
    if (token) {
      this.http.get<{ totalForCurrentMonth: number }>('http://localhost:5093/api/expense/totals', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (data) => {
          this.totalForCurrentMonth = data.totalForCurrentMonth;
          this.calculateProgress();
          console.log(this.totalForCurrentMonth)
        },
        error: (err) => {
          console.error('Error fetching expense totals:', err);
        }
      });
    }
  }
  getCurrentBudget(): void {
    this.budgetService.getCurrentBudget().subscribe({
      next: (data) => {
        this.totalBudget = data.monthlyBudget; 
        this.calculateProgress(); 
        console.log('Current Budget:', this.totalBudget);
      },
      error: (err) => {
        console.error('Error fetching current budget:', err);
      }
    });
  }
  calculateProgress(): void {
    this.progress = Math.min((this.totalForCurrentMonth / this.totalBudget) * 100, 100); 
    this.updateBudgetStatusMessage();
  }
  updateBudgetStatusMessage(): void {
    if (this.totalForCurrentMonth <= this.totalBudget) {
      const remaining = this.totalBudget - this.totalForCurrentMonth;
      this.budgetStatusMessage = `You are within budget. Remaining amount: ${remaining} $.`;
      this.isOverBudget = false;
    } else {
      const exceeded = this.totalForCurrentMonth - this.totalBudget;
      this.budgetStatusMessage = `You have exceeded your budget by ${exceeded} $.`;
      this.isOverBudget = true;
    }
  }
}
