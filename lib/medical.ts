// types/medical.ts
export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  classification: 'antibiotic' | 'vitamin' | 'calcium' | 'gastric' | 'other';
}

export interface TestResult {
  testName: string;
  value: string;
  unit?: string;
  normalRange?: string;
}

export interface VitalSigns {
  respiratoryRate?: string;
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
}

export interface MedicalRecord {
  recordId: string;
  patientId: string;
  patientName: string;
  date: string;           // ← this is the field name, not 'consultationDate'
  doctorName: string;
  patientCase: string;
  symptomsSummary: string;
  medicines: Medicine[];
  testResults: TestResult[];
  vitalSigns: VitalSigns;
  originalFileName: string;
  processedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup?: string;
  allergies: string[];
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  action: 'upload' | 'parse' | 'delete' | 'view' | 'login';
  userId: string;
  userRole: 'patient' | 'doctor' | 'admin';
  details: string;
  timestamp: string;
  success: boolean;
}