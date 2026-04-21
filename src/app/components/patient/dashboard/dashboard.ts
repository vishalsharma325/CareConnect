import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { Doctor, Appointment, User } from '../../../models/models';

@Component({
  selector: 'app-patient-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  data = inject(DataService);
  auth = inject(AuthService);

  allDoctors: Doctor[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  user: User | null = null;

  // Booking state
  selectedDoctor: Doctor | null = null;
  selectedDate = '';
  selectedTime = '';
  consultationReason = '';
  searchQuery = '';

  // Profile state
  isEditingProfile = false;
  editAge: number | undefined;
  editPhone: string | undefined;

  constructor() {
    this.loadData();
  }

  loadData() {
    this.user = this.auth.currentUser();
    if (this.user) {
      // Re-fetch user to get latest
      const freshUser = this.data.getUsers().find(u => u.id === this.user!.id);
      if (freshUser) {
        this.user = freshUser;
        this.auth.currentUser.set(freshUser);
      }
      
      this.editAge = this.user.age;
      this.editPhone = this.user.phone;
      
      this.appointments = this.data.getAppointments()
        .filter(a => a.patientId === this.user!.id)
        .reverse();
    }
    
    this.allDoctors = this.data.getDoctors();
    this.filterDoctors();
  }

  filterDoctors() {
    const q = this.searchQuery.toLowerCase();
    this.doctors = this.allDoctors.filter(d => 
      d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
    );
  }

  selectDoctor(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.selectedDate = '';
    this.selectedTime = '';
    this.consultationReason = '';
  }

  book() {
    if (!this.selectedDoctor || !this.selectedDate || !this.selectedTime || !this.user || !this.consultationReason) return;

    const apt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: this.user.id,
      patientName: this.user.name,
      doctorId: this.selectedDoctor.id,
      doctorName: this.selectedDoctor.name,
      date: this.selectedDate,
      time: this.selectedTime,
      status: 'pending',
      reason: this.consultationReason
    };

    this.data.bookAppointment(apt);
    this.selectedDoctor = null;
    this.loadData();
  }

  cancelApt(id: string) {
    this.data.updateAppointmentStatus(id, 'cancelled');
    this.loadData();
  }

  saveProfile() {
    if (this.user) {
      this.user.age = this.editAge;
      this.user.phone = this.editPhone;
      this.data.updateUser(this.user);
      this.isEditingProfile = false;
      this.loadData();
    }
  }
}
