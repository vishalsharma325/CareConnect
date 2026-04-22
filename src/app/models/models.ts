export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  age?: number;
  sex?: 'Male' | 'Female' | 'Other';
  phone?: string;
}

export interface Doctor extends User {
  specialization: string;
  availableSlots: string[]; // format: "HH:mm"
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  reason: string;
  notes?: string;
}
