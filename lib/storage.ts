// lib/storage.ts
import { MedicalRecord, Patient, Doctor, AuditLog } from './medical';

const STORAGE_KEYS = {
  PATIENTS: 'healthsync_patients',
  DOCTORS: 'healthsync_doctors',
  MEDICAL_RECORDS: 'healthsync_medical_records',
  AUDIT_LOGS: 'healthsync_audit_logs',
  CURRENT_USER: 'healthsync_current_user'
};

export class StorageService {
  static getPatients(): Patient[] {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : [];
  }

  static savePatient(patient: Patient): void {
    const patients = this.getPatients();
    const existing = patients.findIndex(p => p.id === patient.id);
    if (existing >= 0) {
      patients[existing] = patient;
    } else {
      patients.push(patient);
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  static getMedicalRecords(patientId?: string): MedicalRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS);
    const allRecords: MedicalRecord[] = data ? JSON.parse(data) : [];
    return patientId ? allRecords.filter(r => r.patientId === patientId) : allRecords;
  }

  static saveMedicalRecord(record: MedicalRecord): void {
    const records = this.getMedicalRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));
  }

  static deleteMedicalRecord(recordId: string): void {
    const records = this.getMedicalRecords();
    const filtered = records.filter(r => r.recordId !== recordId);
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(filtered));
  }

  static getDoctors(): Doctor[] {
    const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return data ? JSON.parse(data) : [];
  }

  static saveDoctor(doctor: Doctor): void {
    const doctors = this.getDoctors();
    const existing = doctors.findIndex(d => d.id === doctor.id);
    if (existing >= 0) {
      doctors[existing] = doctor;
    } else {
      doctors.push(doctor);
    }
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }

  static deleteUser(userId: string, role: 'patient' | 'doctor'): void {
    if (role === 'patient') {
      const patients = this.getPatients().filter(p => p.id !== userId);
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } else {
      const doctors = this.getDoctors().filter(d => d.id !== userId);
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    }
  }

  static getAuditLogs(): AuditLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [];
  }

  static addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  }

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    localStorage.removeItem(STORAGE_KEYS.MEDICAL_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  }

  static seedMockData(): void {
    this.clearAllData();
    
    const mockPatient: Patient = {
      id: 'P1001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1980-05-15',
      bloodGroup: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    this.savePatient(mockPatient);
    
    const mockRecords: MedicalRecord[] = [
      {
        recordId: 'REC_001',
        patientId: 'P1001',
        patientName: 'John Smith',
        date: '2024-01-15',
        doctorName: 'Dr. Emily Brown',
        patientCase: 'Respiratory infection with fever',
        symptomsSummary: 'Cough, fever 101°F, chest congestion',
        medicines: [
          { name: 'Azithromycin', dosage: '500mg once daily', duration: '3 days', classification: 'antibiotic' },
          { name: 'Vitamin D3', dosage: '2000 IU daily', duration: '30 days', classification: 'vitamin' }
        ],
        testResults: [
          { testName: 'Chest X-Ray', value: 'Normal', unit: '', normalRange: '' },
          { testName: 'WBC Count', value: '11.5', unit: 'K/uL', normalRange: '4.5-11.0' }
        ],
        vitalSigns: { respiratoryRate: '20', bloodPressure: '122/78', heartRate: '88', temperature: '101.2°F' },
        originalFileName: 'prescription_jan15.pdf',
        processedAt: new Date().toISOString()
      },
      {
        recordId: 'REC_002',
        patientId: 'P1001',
        patientName: 'John Smith',
        date: '2024-02-20',
        doctorName: 'Dr. Michael Lee',
        patientCase: 'Follow-up visit for hypertension',
        symptomsSummary: 'Blood pressure monitoring, no acute symptoms',
        medicines: [
          { name: 'Lisinopril', dosage: '10mg daily', duration: '90 days', classification: 'other' },
          { name: 'Calcium + D3', dosage: '600mg daily', duration: '90 days', classification: 'calcium' }
        ],
        testResults: [
          { testName: 'Lipid Panel', value: 'Total Cholesterol: 185', unit: 'mg/dL', normalRange: '<200' },
          { testName: 'BP Monitoring', value: '128/82', unit: 'mmHg', normalRange: '<120/80' }
        ],
        vitalSigns: { respiratoryRate: '16', bloodPressure: '128/82', heartRate: '72', temperature: '98.4°F' },
        originalFileName: 'prescription_feb20.pdf',
        processedAt: new Date().toISOString()
      }
    ];
    
    mockRecords.forEach(record => this.saveMedicalRecord(record));
    
    const mockDoctor: Doctor = {
      id: 'D2001',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@healthsync.com',
      specialization: 'Cardiology',
      licenseNumber: 'MD-12345',
      status: 'active'
    };
    
    this.saveDoctor(mockDoctor);
  }
}