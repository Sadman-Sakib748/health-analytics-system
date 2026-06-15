// components/portals/PatientPortal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, FileText, Trash2, Eye, Calendar, User, Stethoscope, Pill, Activity } from 'lucide-react';
import { StorageService } from '@/lib/storage';

import { MedicalRecord, Patient } from  '../../lib/medical';
import { analyzeMedicalDocument } from '@/lib/ai-service';

interface PatientPortalProps {
  userName: string;
}

export default function PatientPortal({ userName }: PatientPortalProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPatientData();
  }, [userName]);

  const loadPatientData = () => {
    const patients = StorageService.getPatients();
    let currentPatient = patients.find(p => p.name === userName);

    if (!currentPatient) {
      currentPatient = {
        id: `P${Date.now()}`,
        name: userName,
        email: `${userName.toLowerCase().replace(/\s/g, '.')}@example.com`,
        phone: '',
        dateOfBirth: '',
        allergies: [],
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      StorageService.savePatient(currentPatient);
    }

    setPatient(currentPatient);
    const patientRecords = StorageService.getMedicalRecords(currentPatient.id);
    setRecords(patientRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAnalyzing(true);

    try {
      const result = await analyzeMedicalDocument(file);

      StorageService.addAuditLog({
        action: 'upload',
        userId: patient?.id || 'unknown',
        userRole: 'patient',
        details: `Uploaded ${file.name}`,
        success: result.success
      });

      if (result.success && result.data && patient) {
        const newRecord: MedicalRecord = {
          recordId: `REC_${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          date: result.data.date ||   new Date().toISOString().split('T')[0],
          doctorName: result.data.doctorName || 'Unknown Doctor',
          patientCase: result.data.patientCase || 'No case details provided',
          symptomsSummary: result.data.symptomsSummary || '',
          medicines: result.data.medicines || [],
          testResults: result.data.testResults || [],
          vitalSigns: result.data.vitalSigns || {},
          originalFileName: file.name,
          processedAt: new Date().toISOString()
        };

        StorageService.saveMedicalRecord(newRecord);
        loadPatientData();
        alert('Prescription analyzed and saved successfully!');
      } else {
        alert('Failed to analyze document. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing document');
    } finally {
      setUploading(false);
      setAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteRecord = (recordId: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      StorageService.deleteMedicalRecord(recordId);
      loadPatientData();
      StorageService.addAuditLog({
        action: 'delete',
        userId: patient?.id || 'unknown',
        userRole: 'patient',
        details: `Deleted record ${recordId}`,
        success: true
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Patient Portal</h1>
        <p className="text-muted-foreground">Welcome back, {userName}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Patient Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-mono font-semibold">{patient?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{patient?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient?.allergies.length ? patient.allergies.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">
                      {a}
                    </span>
                  )) : <span className="text-sm">None reported</span>}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
              <TabsTrigger value="history">Medical History</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div
                    className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upload Prescription or Medical Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: JPG, PNG, PDF (Max 5MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Button disabled={uploading}>
                      {analyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          AI Analyzing...
                        </>
                      ) : (
                        'Select File'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {records.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No medical records yet</p>
                      <Button variant="link" onClick={() => document.querySelector('[value="upload"]')?.dispatchEvent(new Event('click'))}>
                        Upload your first prescription
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {records.map((record) => (
                        <div key={record.recordId} className="border rounded-lg p-4 hover:bg-accent/5">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{record.date}</span>
                                <span className="text-sm text-muted-foreground">•</span>
                                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{record.doctorName}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{record.patientCase}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelectedRecord(record)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteRecord(record.recordId)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {record.medicines.slice(0, 3).map((med, i) => (
                              <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {med.name}
                              </span>
                            ))}
                            {record.medicines.length > 3 && (
                              <span className="px-2 py-1 bg-muted text-xs rounded-full">
                                +{record.medicines.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Medical Record Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>✕</Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Date</p><p className="font-semibold">{selectedRecord.date}</p></div>
                <div><p className="text-sm text-muted-foreground">Doctor</p><p className="font-semibold">{selectedRecord.doctorName}</p></div>
              </div>

              <div><p className="text-sm text-muted-foreground mb-1">Case Summary</p><p>{selectedRecord.patientCase}</p></div>

              <div><p className="text-sm text-muted-foreground mb-2">Medications</p><div className="space-y-2">{selectedRecord.medicines.map((med, i) => (<div key={i} className="flex justify-between items-center p-2 bg-secondary/10 rounded"><div><p className="font-medium">{med.name}</p><p className="text-xs text-muted-foreground">{med.classification}</p></div><div className="text-right"><p className="text-sm">{med.dosage}</p><p className="text-xs text-muted-foreground">{med.duration}</p></div></div>))}</div></div>

              {selectedRecord.vitalSigns.bloodPressure && (<div><p className="text-sm text-muted-foreground mb-2">Vital Signs</p><div className="grid grid-cols-2 gap-2"><p>BP: {selectedRecord.vitalSigns.bloodPressure}</p><p>RR: {selectedRecord.vitalSigns.respiratoryRate || 'N/A'}</p></div></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}