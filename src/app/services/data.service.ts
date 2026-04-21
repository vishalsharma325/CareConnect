import { Injectable } from '@angular/core';
import { User, Doctor, Appointment } from '../models/models';
import { StorageService } from './storage.service';

const INITIAL_USERS: User[] = [
  { id: '1', name: 'John Patient', email: 'patient@demo.com', role: 'patient' },
  { id: '2', name: 'Dr. Smith', email: 'doctor@demo.com', role: 'doctor' },
  { id: '3', name: 'Admin', email: 'admin@demo.com', role: 'admin' }
];

const INITIAL_DOCTORS: Doctor[] = [
  { id: '2', name: 'Dr. Smith', email: 'doctor@demo.com', role: 'doctor', specialization: 'Cardiology', availableSlots: ['09:00', '10:00', '14:00'] }
];

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private storage: StorageService) {
    this.initData();
  }

  private initData() {
    if (!this.storage.getItem('users')) {
      this.storage.setItem('users', INITIAL_USERS);
    }
    if (!this.storage.getItem('doctors')) {
      this.storage.setItem('doctors', INITIAL_DOCTORS);
    }
    if (!this.storage.getItem('appointments')) {
      this.storage.setItem('appointments', []);
    }
  }

  getUsers(): User[] {
    return this.storage.getItem<User[]>('users') || [];
  }

  saveUsers(users: User[]) {
    this.storage.setItem('users', users);
  }

  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(user: User) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.saveUsers(users);
    }
  }

  deleteUser(id: string) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    this.saveUsers(users);
    
    let docs = this.getDoctors();
    docs = docs.filter(d => d.id !== id);
    this.storage.setItem('doctors', docs);
  }

  getDoctors(): Doctor[] {
    return this.storage.getItem<Doctor[]>('doctors') || [];
  }

  addDoctor(doctor: Doctor) {
    const doctors = this.getDoctors();
    doctors.push(doctor);
    this.storage.setItem('doctors', doctors);
  }

  updateDoctor(doctor: Doctor) {
    const doctors = this.getDoctors();
    const index = doctors.findIndex(d => d.id === doctor.id);
    if (index !== -1) {
      doctors[index] = doctor;
      this.storage.setItem('doctors', doctors);
    }
    
    const users = this.getUsers();
    const uIndex = users.findIndex(u => u.id === doctor.id);
    if (uIndex !== -1) {
      users[uIndex].name = doctor.name;
      this.saveUsers(users);
    }
  }

  getAppointments(): Appointment[] {
    return this.storage.getItem<Appointment[]>('appointments') || [];
  }

  saveAppointments(appointments: Appointment[]) {
    this.storage.setItem('appointments', appointments);
  }

  bookAppointment(apt: Appointment) {
    const apts = this.getAppointments();
    apts.push(apt);
    this.saveAppointments(apts);
  }

  updateAppointmentStatus(id: string, status: 'approved' | 'rejected' | 'cancelled' | 'completed', notes?: string) {
    const apts = this.getAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index !== -1) {
      apts[index].status = status;
      if (notes !== undefined) {
        apts[index].notes = notes;
      }
      this.saveAppointments(apts);
    }
  }

  clearCancelledAndRejected() {
    let apts = this.getAppointments();
    apts = apts.filter(a => a.status !== 'cancelled' && a.status !== 'rejected');
    this.saveAppointments(apts);
  }
}
