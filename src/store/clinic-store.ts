import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Doctor, 
  Patient, 
  Appointment, 
  Visit, 
  AppointmentStatus,
  PaymentStatus 
} from '@/types/clinic';
import { 
  mockDoctors, 
  mockPatients, 
  mockAppointments, 
  mockVisits,
  generateTokenNumber 
} from '@/lib/mock-data';

interface ClinicState {
  // Data
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  visits: Visit[];
  
  // Auth
  currentDoctor: Doctor | null;
  isAuthenticated: boolean;
  
  // Actions - Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Actions - Patients
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'noShowCount'>) => Patient;
  getPatient: (id: string) => Patient | undefined;
  getPatientByPhone: (phone: string) => Patient | undefined;
  updatePatientNoShow: (id: string) => void;
  
  // Actions - Appointments
  createAppointment: (
    patientId: string, 
    doctorId: string, 
    complaint?: string,
    slot?: string
  ) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  getTodayAppointments: (doctorId?: string) => Appointment[];
  getAppointmentByToken: (token: string) => Appointment | undefined;
  
  // Actions - Visits
  addVisit: (visit: Omit<Visit, 'id' | 'createdAt'>) => Visit;
  updateVisitPayment: (id: string, status: PaymentStatus, amount?: number) => void;
  getPatientVisits: (patientId: string) => Visit[];
  getPendingFollowups: () => Visit[];
  
  // Actions - Summary
  getDailySummary: () => {
    totalPatients: number;
    totalCollection: number;
    pendingPayments: number;
    pendingFollowups: number;
  };
}

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      // Initial Data
      doctors: mockDoctors,
      patients: mockPatients,
      appointments: mockAppointments,
      visits: mockVisits,
      currentDoctor: null,
      isAuthenticated: false,

      // Auth
      login: (email: string, _password: string) => {
        const doctor = get().doctors.find(d => d.email === email);
        if (doctor) {
          set({ currentDoctor: doctor, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ currentDoctor: null, isAuthenticated: false });
      },

      // Patients
      addPatient: (patientData) => {
        const newPatient: Patient = {
          ...patientData,
          id: `pat-${Date.now()}`,
          noShowCount: 0,
          createdAt: new Date(),
        };
        set(state => ({ patients: [...state.patients, newPatient] }));
        return newPatient;
      },
      
      getPatient: (id: string) => {
        return get().patients.find(p => p.id === id);
      },
      
      getPatientByPhone: (phone: string) => {
        return get().patients.find(p => p.phone === phone);
      },
      
      updatePatientNoShow: (id: string) => {
        set(state => ({
          patients: state.patients.map(p =>
            p.id === id ? { ...p, noShowCount: p.noShowCount + 1 } : p
          ),
        }));
      },

      // Appointments
      createAppointment: (patientId, doctorId, complaint, slot) => {
        const today = new Date().toISOString().split('T')[0];
        const doctor = get().doctors.find(d => d.id === doctorId);
        const patient = get().patients.find(p => p.id === patientId);
        
        // Count existing appointments for this doctor today
        const todayCount = get().appointments.filter(
          a => a.doctorId === doctorId && a.date === today
        ).length;
        
        const tokenNumber = generateTokenNumber(doctor?.code || 'A', todayCount + 1);
        
        const newAppointment: Appointment = {
          id: `apt-${Date.now()}`,
          patientId,
          doctorId,
          date: today,
          slot,
          tokenNumber,
          status: 'BOOKED',
          complaint,
          createdAt: new Date(),
          patient,
          doctor,
        };
        
        set(state => ({ appointments: [...state.appointments, newAppointment] }));
        return newAppointment;
      },
      
      updateAppointmentStatus: (id: string, status: AppointmentStatus) => {
        set(state => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, status } : a
          ),
        }));
        
        // If skipped, update patient no-show count
        if (status === 'SKIPPED') {
          const appointment = get().appointments.find(a => a.id === id);
          if (appointment) {
            get().updatePatientNoShow(appointment.patientId);
          }
        }
      },
      
      getTodayAppointments: (doctorId?: string) => {
        const today = new Date().toISOString().split('T')[0];
        return get().appointments.filter(a => {
          if (a.date !== today) return false;
          if (doctorId && a.doctorId !== doctorId) return false;
          return true;
        });
      },
      
      getAppointmentByToken: (token: string) => {
        const today = new Date().toISOString().split('T')[0];
        return get().appointments.find(
          a => a.tokenNumber === token && a.date === today
        );
      },

      // Visits
      addVisit: (visitData) => {
        const newVisit: Visit = {
          ...visitData,
          id: `vis-${Date.now()}`,
          createdAt: new Date(),
        };
        set(state => ({ visits: [...state.visits, newVisit] }));
        return newVisit;
      },
      
      updateVisitPayment: (id: string, status: PaymentStatus, amount?: number) => {
        set(state => ({
          visits: state.visits.map(v =>
            v.id === id 
              ? { ...v, paymentStatus: status, ...(amount !== undefined && { amount }) } 
              : v
          ),
        }));
      },
      
      getPatientVisits: (patientId: string) => {
        return get().visits.filter(v => v.patientId === patientId);
      },
      
      getPendingFollowups: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().visits.filter(v => {
          if (!v.followupDate) return false;
          return v.followupDate <= today;
        });
      },

      // Summary
      getDailySummary: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayVisits = get().visits.filter(v => v.visitDate === today);
        const todayAppointments = get().getTodayAppointments();
        
        const totalPatients = todayAppointments.filter(
          a => a.status === 'DONE'
        ).length;
        
        const totalCollection = todayVisits
          .filter(v => v.paymentStatus === 'PAID')
          .reduce((sum, v) => sum + v.amount, 0);
        
        const pendingPayments = todayVisits
          .filter(v => v.paymentStatus === 'PENDING')
          .reduce((sum, v) => sum + v.amount, 0);
        
        const pendingFollowups = get().getPendingFollowups().length;
        
        return {
          totalPatients,
          totalCollection,
          pendingPayments,
          pendingFollowups,
        };
      },
    }),
    {
      name: 'clinic-storage',
    }
  )
);
