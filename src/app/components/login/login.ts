import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.currentUser()) {
      this.auth.routeByRole(this.auth.currentUser()!.role);
    }
  }

  onSubmit() {
    this.error = '';
    const success = this.auth.login(this.email, this.password);
    if (!success) {
      this.error = 'Invalid email or password. Hint: pass123';
    }
  }

  loginAs(role: 'patient' | 'doctor' | 'admin') {
    this.email = `${role}@demo.com`;
    this.password = 'pass123';
    this.onSubmit();
  }
}
