import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BudgetComponent implements OnInit {
  currentBudget: any = null; // Stores the current month's budget details
  budgetAmount: number = 0; // For setting a new budget
  budgetStatus: any = null; // Stores the current month's budget status
  last12Months: any[] = []; // Stores data for the last 12 months
  message: string = ''; // For success/failure messages
  error: string = ''; // For error messages

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.getCurrentBudget();
    this.getBudgetStatus();
    this.getLast12MonthsBudgets();
  }

  // Fetch the current budget
  getCurrentBudget(): void {
    this.budgetService.getCurrentBudget().subscribe({
      next: (response) => {
        this.currentBudget = response;
        this.budgetAmount = response.monthlyBudget || 0; // Pre-fill the budget input
        this.error = '';
      },
      error: (err) => {
        console.error('Error fetching current budget:', err);
        this.error = 'Could not fetch current budget.';
      },
    });
  }

  // Set a new budget
  setBudget(): void {
    if (this.budgetAmount <= 0) {
      this.error = 'Please enter a valid budget amount.';
      return;
    }

    const budgetData = {
      monthlyBudget: this.budgetAmount,
      month: new Date().toISOString(), // Current month
    };

    this.budgetService.setBudget(budgetData).subscribe({
      next: (response) => {
        this.message = 'Budget set successfully.';
        this.currentBudget = response; // Immediately update current budget
        this.getBudgetStatus(); // Refresh the budget status
        this.error = '';
      },
      error: (err) => {
        console.error('Error setting budget:', err);
        this.error = 'Could not set budget.';
      },
    });
  }

  // Fetch the budget status
  getBudgetStatus(): void {
    this.budgetService.checkBudgetStatus().subscribe({
      next: (response) => {
        this.budgetStatus = response;
        this.error = '';
      },
      error: (err) => {
        console.error('Error fetching budget status:', err);
        this.error = 'Could not fetch budget status.';
      },
    });
  }

  // Fetch budgets for the last 12 months
  getLast12MonthsBudgets(): void {
    this.budgetService.getLast12MonthsBudgets().subscribe({
      next: (response) => {
        this.last12Months = response;
        this.error = '';
      },
      error: (err) => {
        console.error('Error fetching last 12 months budgets:', err);
        this.error = 'Could not fetch budgets for the last 12 months.';
      },
    });
  }
}
