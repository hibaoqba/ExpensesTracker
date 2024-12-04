import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ExpenseComponent } from './components/expense/expense.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'expense', component: ExpenseComponent },
];
