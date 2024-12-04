import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import the tap operator

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5093/api/auth'; // Backend URL
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  login(credentials: any) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
