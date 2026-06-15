// components/portals/DoctorPortal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Pill, Activity, FlaskConical, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { MedicalRecord, Patient, Medicine } from  '../../lib/medical';

interface DoctorPortalProps {
  userName: string;
}

export default function DoctorPortal({ userName }: DoctorPortalProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [antibioticsData, setAntibioticsData] = useState<any[]>([]);
  const [categorizedMeds, setCategorizedMeds] = useState({
    antibiotics: [] as Medicine[],
    vitamins: [] as Medicine[],
    calcium: [] as Medicine[],
    gastric: [] as Medicine[],
    other: [] as Medicine[]
  });

  useEffect(() => {
    const allPatients = StorageService.getPatients();
    setPatients(allPatients);
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    const records = StorageService.getMedicalRecords(patient.id);
    const sortedRecords = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setPatientRecords(sortedRecords);
    
    // Extract antibiotics
    const allMeds = records.flatMap(r => r.medicines.map(m => ({ ...m, recordDate: r.date, doctorName: r.doctorName })));
    const antibiotics = allMeds.filter(m => m.classification === 'antibiotic');
    setAntibioticsData(antibiotics);
    
    // Categorize all medications
    const categorized = {
      antibiotics: records.flatMap(r => r.medicines.filter(m => m.classification === 'antibiotic')),
      vitamins: records.flatMap(r => r.medicines.filter(m => m.classification === 'vitamin')),
      calcium: records.flatMap(r => r.medicines.filter(m => m.classification === 'calcium')),
      gastric: records.flatMap(r => r.medicines.filter(m => m.classification === 'gastric')),
      other: records.flatMap(r => r.medicines.filter(m => m.classification === 'other'))
    };
    setCategorizedMeds(categorized);
    
    StorageService.addAuditLog({
      action: 'view',
      userId: userName,
      userRole: 'doctor',
      details: `Viewed patient ${patient.name} (${patient.id})`,
      success: true
    });
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Doctor Portal</h1>
        <p className="text-muted-foreground">Welcome, Dr. {userName}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Search Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Patient Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="Search by name or Patient ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedPatient?.id === patient.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{patient.id}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Dashboard */}
        <div className="lg:col-span-2">
          {!selectedPatient ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Select a patient to view their health dashboard</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Patient Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                      <p className="text-muted-foreground font-mono">{selectedPatient.id}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>📅 DOB: {selectedPatient.dateOfBirth || 'N/A'}</span>
                        <span>🩸 Blood: {selectedPatient.bloodGroup || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Records</p>
                      <p className="text-3xl font-bold">{patientRecords.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="antibiotics">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="antibiotics">Antibiotics</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="tests">Test Results</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                {/* Antibiotic Tracker */}
                <TabsContent value="antibiotics" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Antibiotic Usage Tracker
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {antibioticsData.length === 0 ? (
                        <div className="text-center py-8">
                          <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p>No antibiotic prescriptions recorded</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-destructive/10 p-4 rounded-lg mb-4">
                            <p className="font-semibold">Lifetime Usage Summary</p>
                            <p className="text-2xl font-bold">{antibioticsData.length} antibiotic courses</p>
                            <p className="text-sm">Unique antibiotics: {[...new Set(antibioticsData.map(a => a.name))].length}</p>
                          </div>
                          {antibioticsData.map((antibiotic, idx) => (
                            <div key={idx} className="border-l-4 border-destructive pl-4 py-2">
                              <p className="font-semibold">{antibiotic.name}</p>
                              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {antibiotic.duration}</span>
                                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Dr. {antibiotic.doctorName}</span>
                                <span>{antibiotic.recordDate}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medication Categorization */}
                <TabsContent value="medications" className="mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card><CardHeader><CardTitle>💊 Antibiotics</CardTitle></CardHeader><CardContent>{categorizedMeds.antibiotics.map((m, i) => <div key={i} className="py-2 border-b last:border-0"><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.dosage} • {m.duration}</p></div>)}</CardContent></Card>
                    <Card><CardHeader><CardTitle>🥬 Vitamins</CardTitle></CardHeader><CardContent>{categorizedMeds.vitamins.map((m, i) => <div key={i} className="py-2 border-b last:border-0"><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.dosage}</p></div>)}</CardContent></Card>
                    <Card><CardHeader><CardTitle>🦴 Calcium</CardTitle></CardHeader><CardContent>{categorizedMeds.calcium.map((m, i) => <div key={i} className="py-2 border-b last:border-0"><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.dosage}</p></div>)}</CardContent></Card>
                    <Card><CardHeader><CardTitle>🍽️ Gastric</CardTitle></CardHeader><CardContent>{categorizedMeds.gastric.map((m, i) => <div key={i} className="py-2 border-b last:border-0"><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.dosage}</p></div>)}</CardContent></Card>
                  </div>
                </TabsContent>

                {/* Test Results */}
                <TabsContent value="tests" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><FlaskConical className="w-5 h-5" /> Diagnostic Test History</CardTitle></CardHeader>
                    <CardContent>
                      {patientRecords.flatMap(r => r.testResults).length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No test results available</p>
                      ) : (
                        <div className="space-y-4">
                          {patientRecords.map((record) => (
                            record.testResults.length > 0 && (
                              <div key={record.recordId} className="border rounded-lg p-3">
                                <p className="font-semibold text-sm">{record.date}</p>
                                {record.testResults.map((test, i) => (
                                  <div key={i} className="flex justify-between items-center mt-2 p-2 bg-secondary/10 rounded">
                                    <span>{test.testName}</span>
                                    <span className="font-mono font-semibold">{test.value}</span>
                                  </div>
                                ))}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Timeline */}
                <TabsContent value="timeline" className="mt-4">
                  <Card>
                    <CardHeader><CardTitle>📋 Complete Medical Timeline</CardTitle></CardHeader>
                    <CardContent>
                      <div className="relative pl-8 space-y-6">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
                        {patientRecords.map((record, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-8 mt-1 w-4 h-4 bg-primary rounded-full border-4 border-card"></div>
                            <div className="bg-secondary/10 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold">{record.date}</p>
                                  <p className="text-sm text-muted-foreground">Dr. {record.doctorName}</p>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{record.patientCase}</p>
                              <div className="flex flex-wrap gap-1">
                                {record.medicines.map((m, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{m.name}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}