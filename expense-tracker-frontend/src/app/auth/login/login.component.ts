import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // For API calls

@Component({
  selector: 'app-login',
  standalone: true, // Standalone component
  imports: [FormsModule, HttpClientModule], // Include FormsModule and HttpClientModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { 
    username: '', 
    password: '' 
  }; // Model for user login
  private apiUrl = 'http://localhost:5093/api/auth/login'; // API endpoint for login

  constructor(private http: HttpClient) {}

  onLogin(form: any): void {
    if (form.valid) {  // Ensure form is valid
      this.http.post<{ token: string }>(this.apiUrl, this.credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);  // Handle the login response, assuming it contains a token
          localStorage.setItem('token', response.token);  // Store token in localStorage for authentication
          this.credentials = { username: '', password: '' }; // Reset credentials model
          form.resetForm(); // Reset the form
        },
        error: (err) => {
          console.error('Error during login:', err);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
