import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { HttpClientModule } from '@angular/common/http';  // For HTTP requests
import { AppComponent } from './app.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { LoginComponent } from './auth/login/login.component'; // Make sure to import LoginComponent
import { BudgetComponent } from './components/budget/budget.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YearlyOverviewComponent } from './components/yearly-overview/yearly-overview.component';
import { CurrencyPipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    BudgetComponent,
    LoginComponent ,
    YearlyOverviewComponent 
  ],
  imports: [
    BrowserModule,
     HttpClientModule, 
     CommonModule,
     CurrencyPipe,
    FormsModule  
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
