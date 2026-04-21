import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class HomeComponent {
  specialities = [
    { name: 'Gynecology', icon: 'pregnant_woman' },
    { name: 'Dermatology', icon: 'face' },
    { name: 'Pediatrics', icon: 'child_care' },
    { name: 'Psychiatry', icon: 'psychology' },
    { name: 'General Physician', icon: 'medical_services' },
    { name: 'Orthopedics', icon: 'accessible_forward' }
  ];

  topDoctors = [
    {
      name: 'Dr. Tejashree M',
      speciality: 'Laparoscopic Surgeon (Obs & Gyn)',
      experience: '11 years',
      consults: '32919 consults',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'Dr. Vidhi Shah',
      speciality: 'Gynecologist, Obstetrician',
      experience: '8 years',
      consults: '373 consults',
      image: 'https://images.unsplash.com/photo-1594824436998-d40d9eb4df73?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'Dr. Rashmi Nandwana',
      speciality: 'Dermatologist',
      experience: '19 years',
      consults: '16134 consults',
      image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'Dr. Tariq Ahmad Bhat',
      speciality: 'Sexologist, Psychiatrist',
      experience: '12 years',
      consults: '42990 consults',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150'
    }
  ];
}
