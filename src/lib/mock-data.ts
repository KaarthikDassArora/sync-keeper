import { Doctor, Patient, Appointment, Visit, QueueState } from '@/types/clinic';

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rahul Sharma',
    code: 'A',
    email: 'rahul@clinic.com',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Sharma',
    code: 'B',
    email: 'priya@clinic.com',
    createdAt: new Date('2024-01-01'),
  },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'pat-1',
    name: 'Amit Kumar',
    phone: '9876543210',
    age: 35,
    noShowCount: 0,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pat-2',
    name: 'Sunita Devi',
    phone: '9876543211',
    age: 28,
    noShowCount: 2,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'pat-3',
    name: 'Rajesh Gupta',
    phone: '9876543212',
    age: 45,
    noShowCount: 0,
    createdAt: new Date('2024-03-05'),
  },
  {
    id: 'pat-4',
    name: 'Meera Singh',
    phone: '9876543213',
    age: 32,
    noShowCount: 1,
    createdAt: new Date('2024-03-20'),
  },
];

const today = new Date().toISOString().split('T')[0];

// Mock Appointments (Today's Queue)
export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    date: today,
    slot: 'Morning',
    tokenNumber: 'A-001',
    status: 'DONE',
    complaint: 'Tooth pain',
    createdAt: new Date(),
    patient: mockPatients[0],
    doctor: mockDoctors[0],
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    date: today,
    slot: 'Morning',
    tokenNumber: 'A-002',
    status: 'IN_PROGRESS',
    complaint: 'Cavity filling',
    createdAt: new Date(),
    patient: mockPatients[1],
    doctor: mockDoctors[0],
  },
  {
    id: 'apt-3',
    patientId: 'pat-3',
    doctorId: 'doc-1',
    date: today,
    slot: 'Morning',
    tokenNumber: 'A-003',
    status: 'BOOKED',
    complaint: 'Cleaning',
    createdAt: new Date(),
    patient: mockPatients[2],
    doctor: mockDoctors[0],
  },
  {
    id: 'apt-4',
    patientId: 'pat-4',
    doctorId: 'doc-2',
    date: today,
    slot: 'Morning',
    tokenNumber: 'B-001',
    status: 'CALLED',
    complaint: 'Root canal',
    createdAt: new Date(),
    patient: mockPatients[3],
    doctor: mockDoctors[1],
  },
];

// Mock Visits (History)
export const mockVisits: Visit[] = [
  {
    id: 'vis-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    visitDate: '2024-12-15',
    chiefComplaint: 'Tooth pain - upper right molar',
    diagnosis: 'Dental caries',
    treatmentNotes: 'Cavity filling done',
    prescriptionText: 'Ibuprofen 400mg - 1 tab twice daily for 3 days',
    followupDate: '2025-01-20',
    amount: 1500,
    paymentStatus: 'PAID',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'vis-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    visitDate: '2024-12-20',
    chiefComplaint: 'Gum bleeding',
    diagnosis: 'Gingivitis',
    treatmentNotes: 'Scaling and polishing',
    prescriptionText: 'Chlorhexidine mouthwash',
    followupDate: '2025-01-10',
    amount: 2000,
    paymentStatus: 'PENDING',
    createdAt: new Date('2024-12-20'),
  },
];

// Mock Queue State
export const mockQueueState: QueueState[] = [
  {
    doctorId: 'doc-1',
    date: today,
    currentToken: 'A-002',
    updatedAt: new Date(),
  },
  {
    doctorId: 'doc-2',
    date: today,
    currentToken: 'B-001',
    updatedAt: new Date(),
  },
];

// Helper to generate token number
export const generateTokenNumber = (doctorCode: 'A' | 'B', count: number): string => {
  return `${doctorCode}-${String(count).padStart(3, '0')}`;
};
