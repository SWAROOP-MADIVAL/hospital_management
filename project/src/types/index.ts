export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
}

export interface Doctor extends User {
  specialization: string;
  experience: number;
  availability: string[];
}

export interface Patient extends User {
  age: number;
  bloodGroup: string;
  medicalHistory: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}