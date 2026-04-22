import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-setup.html'
})
export class ProfileSetupComponent {
  name = '';
  age: number | null = null;
  sex: 'Male' | 'Female' | 'Other' = 'Male';
  role: 'patient' | 'doctor' = 'patient';
  phone = '';
  specialty = '';
  qualifications = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private data: DataService, private router: Router) {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
    } else if (user.name) {
      // already has a profile setup
      this.auth.routeByRole(user.role);
    }
  }

  onSubmit() {
    this.error = '';
    this.loading = true;
    
    try {
      const user = this.auth.currentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      
      const updatedUser = {
        ...user,
        name: this.name,
        age: this.age,
        sex: this.sex,
        role: this.role,
        phone: this.phone,
        ...(this.role === 'doctor' ? {
          specialty: this.specialty,
          qualifications: this.qualifications,
          experience: '0 years',
          rating: 0,
          patients: 0,
          availability: [],
          avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.name) + '&background=random'
        } : {})
      };
      
      this.data.addUser(updatedUser as any);
      this.auth.updateUser(updatedUser as any);
      
      this.auth.routeByRole(this.role);
    } catch(err) {
      this.error = 'Failed to setup profile';
    } finally {
      this.loading = false;
    }
  }
}
