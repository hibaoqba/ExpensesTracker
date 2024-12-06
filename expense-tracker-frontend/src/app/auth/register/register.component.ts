import { Component } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
  };
  private apiUrl = 'http://localhost:5093/api/auth/register'; 
  successMessage = '';
  showSuccessMessage = false; 

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(form: any): void {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      this.http.post(this.apiUrl, this.user, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage = 'Registration successful! You can now log in.';
          this.showSuccessMessage = true; 
          this.user = {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            fullName: '',
          };
          form.resetForm();
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/login']);
          }, 3000);
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
