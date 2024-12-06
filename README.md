# Expense Tracker

This is a full-stack web application for tracking expenses and budgets. The application consists of a **frontend** built with Angular 18 and a **backend** built with **.NET 8**. It allows users to manage their expenses, track budgets, and get an overview of their financial data.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [API Endpoints](#api-endpoints)
6. [Frontend Features](#frontend-features)
7. [Backend Features](#backend-features)

## Project Overview

The **Expense Tracker** project consists of two parts:

- **Frontend**: Built using **Angular**. This part handles the user interface where users can input their expenses, view budget summaries, track monthly expenses, and see progress on their budgets.
  
- **Backend**: Built using **.NET 8**. The backend handles API requests, manages the expense and budget data, and performs database operations using **SQLite**.

The frontend and backend are separate but work together to provide a seamless user experience for tracking expenses.

## Technologies Used

### Frontend:
- **Angular** (Version 18): A popular framework for building dynamic web applications.
- **Angular Material**: Provides UI components for a modern design.
- **Ngx-Charts**: Used for displaying financial data in charts.
- **Bootstrap**: Used for responsive design and styling.
- **FontAwesome**: Provides icons for UI elements.
- **Chart.js**: For displaying charts such as pie charts and progress bars.

### Backend:
- **.NET 8**: A modern framework for building web APIs and services.
- **SQLite**: A lightweight database used for storing expense and budget data.
- **Entity Framework Core**: Used to interact with the SQLite database.

### Dev Tools:
- **TypeScript**: A statically typed superset of JavaScript.
- **Karma/Jasmine**: Used for unit testing Angular components.
- **Jasmine**: A testing framework for JavaScript.
- **Swagger**: For API documentation and testing.
  
## Frontend Setup

To get started with the frontend:

1. Install Node.js and npm (Node Package Manager) if you haven’t already.
2. Clone the repository

3. Install the dependencies:
npm install

4. Serve the Angular application

## Backend Setup:

1. Navigate to the backend directory:
cd expense-tracker-backend

2. Restore the dependencies:
dotnet restore

3. Run the application:
dotnet run

## API endpoints
1. **budget**
GET /api/budget: Fetches all budgets.
POST /api/budget: Creates a new budget.
GET /api/budget/current: Fetches the current month's budget.
GET /api/budget/status: Checks if expenses for the current month exceed the budget.
GET /api/budget/last-12-months: Fetches budgets for the last 12 months.

2.**Expense**
GET /api/expense: Fetches all expenses.
POST /api/expense: Creates a new expense.
DELETE /api/expense/{id}: Deletes an expense by its ID.
GET /api/expense/monthly: Fetches the monthly expense totals.
GET /api/expense/totals-by-category: Fetches total expenses by category for the current month.
GET /api/expense/monthly-totals: Fetches monthly expense totals for the last 12 months.

## Frontend Features
**Dashboard Overview**: Displays an overview of the expenses and budgets for the last 12 months, including charts and progress indicators.
**Charts**: Visualizes expense data using ngx-charts and chart.js.
**Expense Tracking**: Allows users to input and track their expenses.
**Budget Tracking**: Allows users to define budgets and monitor their progress.
**Responsive Design**: The application is fully responsive, designed for mobile and desktop devices.

## Backend Features
**Authentication**: Secure user authentication using JWT tokens.
**Expense Management**: Manages expenses by storing, updating, and retrieving them.
**Budget Management**: Allows users to define and manage their budgets.
**Monthly Expense Calculation**: Aggregates expenses on a monthly basis to show overall spending trends.



