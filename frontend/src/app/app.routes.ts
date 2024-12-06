import { Routes } from '@angular/router';
import { ExpenseComponent } from './components/expense/expense.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { BudgetComponent } from './components/budget/budget.component';
import { CategoryComponent } from './components/category/category.component';
import { YearlyOverviewComponent } from './components/yearly-overview/yearly-overview.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent  },
  {path: 'register', component: RegisterComponent },
  {path: 'budget', component: BudgetComponent,canActivate: [AuthGuard]},
  { path: 'expense', component: ExpenseComponent , canActivate: [AuthGuard] },
  { path :'category',component:CategoryComponent, canActivate:[AuthGuard]},
  { path :'overview',component:YearlyOverviewComponent, canActivate:[AuthGuard]}

];
