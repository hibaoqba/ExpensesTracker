import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // For API calls

@Component({
  selector: 'app-register',
  standalone: true, // Standalone component
  imports: [FormsModule, HttpClientModule], // Include FormsModule and HttpClientModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = { 
    username: '', 
    password: '', 
    confirmPassword: '', // Add confirmPassword
    email: '', 
    fullName: '' 
  }; // Model for user registration
  private apiUrl = 'http://localhost:5093/api/auth/register'; // API endpoint for registration

  constructor(private http: HttpClient) {}

  onRegister(form: any): void {
    if (form.valid && this.user.password === this.user.confirmPassword) {  // Ensure passwords match
      this.http.post(this.apiUrl, this.user, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);  // response will now be the plain text
          this.user = { username: '', password: '', confirmPassword: '', email: '', fullName: '' }; // Reset user model
          form.resetForm(); // Reset the form
        },
        error: (err) => {
          console.error('Error during registration:', err);
        },
      });
    } else {
      console.error('Passwords do not match or form is invalid');
    }
  }
}  