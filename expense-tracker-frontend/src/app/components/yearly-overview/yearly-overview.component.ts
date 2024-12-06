import { Component } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { ExpenseService } from '../../services/expense.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-yearly-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './yearly-overview.component.html',
  styleUrls: ['./yearly-overview.component.css']
})
export class YearlyOverviewComponent {
  budgets: any[] = [];
  expenses: any[] = [];
  yearlyData: any[] = [];
  errorMessage: string = '';
  selectedMonth: any = null;

  constructor(
    private budgetService: BudgetService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadYearlyData();
  }

  loadYearlyData(): void {
    this.budgetService.getLast12MonthsBudgets().subscribe(
      (budgetData) => {
        this.budgets = budgetData;
        this.expenseService.getMonthlyExpenseTotals().subscribe(
          (expenseData) => {
            this.expenses = expenseData;
            this.prepareData();
          },
          (error) => {
            this.errorMessage = 'Failed to load expenses';
          }
        );
      },
      (error) => {
        this.errorMessage = 'Failed to load budgets';
      }
    );
  }

  prepareData(): void {
    this.yearlyData = this.budgets.map((budget) => {
      const expense = this.expenses.find(
        (exp) => exp.year === budget.year && exp.month === budget.month
      );
      
      const totalExpense = expense ? expense.totalExpense : 0;
      const savings = budget.budget - totalExpense;

      return {
        ...budget,
        totalExpense,
        savings,  // Add savings field
        isExceeded: totalExpense > budget.budget
      };
    });
  }

  getProgressBarValue(data: any): number {
    return (data.totalExpense / data.budget) * 100;  // Percentage of budget used
  }

  getMonthName(month: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  }
}
