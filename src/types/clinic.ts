// Dental Clinic Types

export type AppointmentStatus = 'BOOKED' | 'CALLED' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED';
export type DoctorCode = 'A' | 'B';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL';

export interface Doctor {
  id: string;
  name: string;
  code: DoctorCode;
  email: string;
  createdAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age?: number;
  noShowCount: number;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  slot?: string;
  tokenNumber: string;
  status: AppointmentStatus;
  complaint?: string;
  createdAt: Date;
  // Joined data
  patient?: Patient;
  doctor?: Doctor;
}

export interface QueueState {
  doctorId: string;
  date: string;
  currentToken?: string;
  updatedAt: Date;
}

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatmentNotes?: string;
  prescriptionText?: string;
  followupDate?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  // Joined data
  patient?: Patient;
  doctor?: Doctor;
}

export interface WhatsAppLog {
  id: string;
  patientId?: string;
  appointmentId?: string;
  type: 'TOKEN' | 'CALL_ALERT' | 'SUMMARY' | 'REMINDER';
  payload: Record<string, unknown>;
  status: 'SENT' | 'FAILED';
  createdAt: Date;
}

export interface DailySummary {
  totalPatients: number;
  totalCollection: number;
  pendingPayments: number;
  pendingFollowups: number;
}
