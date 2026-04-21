import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { Appointment, Doctor } from '../../../models/models';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  data = inject(DataService);
  auth = inject(AuthService);

  appointments: Appointment[] = [];
  doctor: Doctor | null = null;
  user = this.auth.currentUser();

  newSlot = '';
  isEditingProfile = false;
  editName = '';
  editSpecialization = '';

  completingAptId: string | null = null;
  prescriptionNotes = '';

  constructor() {
    this.loadData();
    // Add event listener for cross-tab synchronization
    window.addEventListener('storage', () => {
      this.loadData();
    });
  }

  loadData() {
    this.user = this.auth.currentUser(); // get fresh user
    if (this.user) {
      this.appointments = this.data.getAppointments()
        .filter(a => a.doctorId === this.user!.id)
        .reverse();
      this.doctor = this.data.getDoctors().find(d => d.id === this.user!.id) || null;
      if (this.doctor) {
        this.editName = this.doctor.name;
        this.editSpecialization = this.doctor.specialization;
      }
    }
  }

  refresh() {
    this.loadData();
  }

  updateStatus(id: string, status: 'approved' | 'rejected' | 'completed') {
    if (status === 'completed') {
      this.completingAptId = id;
      this.prescriptionNotes = '';
      return;
    }
    this.data.updateAppointmentStatus(id, status);
    this.loadData();
  }

  submitCompletion() {
    if (this.completingAptId) {
      this.data.updateAppointmentStatus(this.completingAptId, 'completed', this.prescriptionNotes);
      this.completingAptId = null;
      this.prescriptionNotes = '';
      this.loadData();
    }
  }

  cancelCompletion() {
    this.completingAptId = null;
    this.prescriptionNotes = '';
  }

  addSlot() {
    if (this.newSlot && this.doctor) {
      if (!this.doctor.availableSlots.includes(this.newSlot)) {
        this.doctor.availableSlots.push(this.newSlot);
        this.doctor.availableSlots.sort();
        this.data.updateDoctor(this.doctor);
      }
      this.newSlot = '';
    }
  }

  removeSlot(slot: string) {
    if (this.doctor) {
      this.doctor.availableSlots = this.doctor.availableSlots.filter(s => s !== slot);
      this.data.updateDoctor(this.doctor);
    }
  }

  saveProfile() {
    if (this.doctor && this.editName && this.editSpecialization) {
      this.doctor.name = this.editName;
      this.doctor.specialization = this.editSpecialization;
      this.data.updateDoctor(this.doctor);
      
      if (this.user) {
        this.user.name = this.editName;
      }
      this.isEditingProfile = false;
    }
  }
}
