import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // <-- Import this

import { AppComponent } from './app.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, ExpenseComponent],
    imports: [BrowserModule, 
    HttpClientModule,
    FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
