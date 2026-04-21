import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { User, Doctor, Appointment } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  data = inject(DataService);

  users: User[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];

  showAddDoctor = false;
  newDocName = '';
  newDocEmail = '';
  newDocSpecialization = '';

  constructor() {
    this.loadData();
  }

  loadData() {
    this.users = this.data.getUsers();
    this.doctors = this.data.getDoctors();
    this.appointments = this.data.getAppointments().reverse();
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.data.deleteUser(id);
      this.loadData();
    }
  }

  addDoctor() {
    if (!this.newDocName || !this.newDocEmail || !this.newDocSpecialization) return;
    
    const id = Math.random().toString(36).substr(2, 9);
    
    const newUser: User = {
      id,
      name: this.newDocName,
      email: this.newDocEmail,
      role: 'doctor'
    };
    
    const newDoctor: Doctor = {
      ...newUser,
      specialization: this.newDocSpecialization,
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'] // default slots
    };

    this.data.addUser(newUser);
    this.data.addDoctor(newDoctor);
    
    this.newDocName = '';
    this.newDocEmail = '';
    this.newDocSpecialization = '';
    this.showAddDoctor = false;
    
    this.loadData();
  }

  clearOldAppointments() {
    if (confirm('Clear all cancelled and rejected appointments?')) {
      this.data.clearCancelledAndRejected();
      this.loadData();
    }
  }
}
