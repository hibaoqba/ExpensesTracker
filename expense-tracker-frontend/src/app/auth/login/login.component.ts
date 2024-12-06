import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = {
    username: '',
    password: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  onLogin(form: any): void {
    if (form.valid) {
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          form.resetForm(); // Reset form
          this.router.navigate(['/expense']); // Navigate to /expense
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
