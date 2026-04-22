import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.currentUser()) {
      this.auth.routeByRole(this.auth.currentUser()!.role);
    }
  }

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      const success = await this.auth.register(this.email, this.password);
      if (success) {
        // Redirect to profile setup
        this.router.navigate(['/profile-setup']);
      } else {
        this.error = 'Registration failed. Please try again.';
      }
    } catch (err: any) {
      this.error = err.message || 'An error occurred during registration.';
    } finally {
      this.loading = false;
    }
  }

  async registerWithGoogle() {
    this.error = '';
    const success = await this.auth.signInWithGoogle();
    if (!success) {
      this.error = 'Google Sign-In failed.';
    }
  }
}
