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
  currentBudget: any = null;
  budgetAmount: number = 0; 
  budgetStatus: any = null; 
  last12Months: any[] = []; 
  message: string = ''; 
  error: string = ''; 

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.getCurrentBudget();
    this.getBudgetStatus();
    this.getLast12MonthsBudgets();
  }

  getCurrentBudget(): void {
    this.budgetService.getCurrentBudget().subscribe({
      next: (response) => {
        this.currentBudget = response;
        this.budgetAmount = response.monthlyBudget || 0;
        this.error = '';
      },
      error: (err) => {
        console.error('Error fetching current budget:', err);
        this.error = 'Could not fetch current budget.';
      },
    });
  }

  setBudget(): void {
    if (this.budgetAmount <= 0) {
      this.error = 'Please enter a valid budget amount.';
      return;
    }

    const budgetData = {
      monthlyBudget: this.budgetAmount,
      month: new Date().toISOString(), 
    };

    this.budgetService.setBudget(budgetData).subscribe({
      next: (response) => {
        this.message = 'Budget set successfully.';
        this.currentBudget = response; 
        this.getBudgetStatus(); 
        this.error = '';
      },
      error: (err) => {
        console.error('Error setting budget:', err);
        this.error = 'Could not set budget.';
      },
    });
  }

  getBudgetStatus(): void {
    this.budgetService.checkBudgetStatus().subscribe({
      next: (response) => {
        this.budgetStatus = response;
        this.error = '';
      },
      error: (err) => {
        console.error('Error fetching budget status:', err);
        this.error = 'Please set a budget';
      },
    });
  }

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
