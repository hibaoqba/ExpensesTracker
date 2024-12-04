import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { HttpClientModule } from '@angular/common/http';  // For HTTP requests
import { AppComponent } from './app.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { LoginComponent } from './auth/login/login.component'; // Make sure to import LoginComponent

@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    LoginComponent  // Declare LoginComponent here
  ],
  imports: [
    BrowserModule,
     HttpClientModule, // Ensure HttpClientModule is added here
    FormsModule  // Import FormsModule here for ngModel
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
