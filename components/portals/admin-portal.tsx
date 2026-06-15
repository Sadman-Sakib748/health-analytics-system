// components/portals/AdminPortal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Stethoscope, FileText, Database, Trash2, Eye, Activity, Settings, Plus, Edit2, X } from 'lucide-react';
import { StorageService } from '@/lib/storage';
import { Patient, Doctor, AuditLog, MedicalRecord } from '../../lib/medical';

interface AdminPortalProps {
  userName: string;
}

export default function AdminPortal({ userName }: AdminPortalProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserType, setNewUserType] = useState<'patient' | 'doctor'>('patient');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPatients(StorageService.getPatients());
    setDoctors(StorageService.getDoctors());
    setAuditLogs(StorageService.getAuditLogs());
    setRecords(StorageService.getMedicalRecords());
  };

  const handleDeleteUser = (userId: string, role: 'patient' | 'doctor') => {
    if (confirm(`Are you sure you want to delete this ${role}?`)) {
      StorageService.deleteUser(userId, role);
      refreshData();
      StorageService.addAuditLog({
        action: 'delete',
        userId: userName,
        userRole: 'admin',
        details: `Deleted ${role} with ID ${userId}`,
        success: true
      });
    }
  };

  const handleSeedMockData = () => {
    if (confirm('This will replace all existing data with mock data. Continue?')) {
      StorageService.seedMockData();
      refreshData();
      alert('Mock data loaded successfully!');
    }
  };

  const handleClearAllData = () => {
    if (confirm('WARNING: This will delete ALL data. This action cannot be undone. Continue?')) {
      StorageService.clearAllData();
      refreshData();
      alert('All data cleared');
    }
  };

  const handleAddUser = () => {
    if (newUserType === 'patient') {
      const newPatient: Patient = {
        id: `P${Date.now()}`,
        name: 'New Patient',
        email: 'new.patient@example.com',
        phone: '',
        dateOfBirth: '',
        allergies: [],
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      StorageService.savePatient(newPatient);
    } else {
      const newDoctor: Doctor = {
        id: `D${Date.now()}`,
        name: 'New Doctor',
        email: 'new.doctor@example.com',
        specialization: 'General Medicine',
        licenseNumber: 'PENDING',
        status: 'active'
      };
      StorageService.saveDoctor(newDoctor);
    }
    refreshData();
    setShowAddUser(false);
  };

  const totalDocumentsParsed = records.length;
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">System Management Console</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedMockData}>
            <Database className="w-4 h-4 mr-2" />
            Load Mock Data
          </Button>
          <Button variant="destructive" onClick={handleClearAllData}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Patients</p><p className="text-3xl font-bold">{totalPatients}</p></div><Users className="w-8 h-8 text-primary opacity-50" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Doctors</p><p className="text-3xl font-bold">{totalDoctors}</p></div><Stethoscope className="w-8 h-8 text-secondary opacity-50" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Documents Parsed</p><p className="text-3xl font-bold">{totalDocumentsParsed}</p></div><FileText className="w-8 h-8 text-accent opacity-50" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">System Logs</p><p className="text-3xl font-bold">{auditLogs.length}</p></div><Activity className="w-8 h-8 text-muted-foreground opacity-50" /></div></CardContent></Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Directory</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Patient & Doctor Directory</CardTitle>
              <Button onClick={() => { setShowAddUser(true); setNewUserType('patient'); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Patients Section */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Patients ({patients.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr><th className="text-left py-2">ID</th><th className="text-left">Name</th><th className="text-left">Email</th><th className="text-left">Records</th><th className="text-left">Status</th><th className="text-right">Actions</th></tr>
                      </thead>
                      <tbody>
                        {patients.map((p) => (
                          <tr key={p.id} className="border-b">
                            <td className="py-2 font-mono text-xs">{p.id}</td>
                            <td>{p.name}</td>
                            <td className="text-muted-foreground">{p.email}</td>
                            <td>{records.filter(r => r.patientId === p.id).length}</td>
                            <td><span className={`px-2 py-0.5 text-xs rounded ${p.status === 'active' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>{p.status}</span></td>
                            <td className="text-right"><Button size="sm" variant="destructive" onClick={() => handleDeleteUser(p.id, 'patient')}><Trash2 className="w-3 h-3" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Doctors Section */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> Doctors ({doctors.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr><th className="text-left py-2">ID</th><th className="text-left">Name</th><th className="text-left">Specialization</th><th className="text-left">License</th><th className="text-left">Status</th><th className="text-right">Actions</th></tr>
                      </thead>
                      <tbody>
                        {doctors.map((d) => (
                          <tr key={d.id} className="border-b">
                            <td className="py-2 font-mono text-xs">{d.id}</td>
                            <td>{d.name}</td>
                            <td>{d.specialization}</td>
                            <td className="text-muted-foreground">{d.licenseNumber}</td>
                            <td><span className={`px-2 py-0.5 text-xs rounded ${d.status === 'active' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>{d.status}</span></td>
                            <td className="text-right"><Button size="sm" variant="destructive" onClick={() => handleDeleteUser(d.id, 'doctor')}><Trash2 className="w-3 h-3" /></Button></td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader><CardTitle>System Audit Logs</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No audit logs available</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border-b hover:bg-accent/5">
                      <div className={`w-2 h-2 mt-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{log.action.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-sm">User: {log.userId} ({log.userRole})</p>
                        <p className="text-xs text-muted-foreground">{log.details}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> System Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="font-semibold text-yellow-700">⚠️ Data Management</p>
                <p className="text-sm mt-1">Use these tools to manage system data</p>
              </div>
              <div className="grid gap-4">
                <Button variant="outline" onClick={handleSeedMockData} className="justify-start"><Database className="w-4 h-4 mr-2" /> Inject Mock Patient Dataset</Button>
                <Button variant="destructive" onClick={handleClearAllData} className="justify-start"><Trash2 className="w-4 h-4 mr-2" /> Clear All localStorage Data</Button>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">System Status: <span className="text-green-600">● Operational</span></p>
                <p className="text-xs text-muted-foreground mt-2">AI Engine: Active • Last Sync: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddUser(false)}>
          <div className="bg-card rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New User</h3>
              <button onClick={() => setShowAddUser(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant={newUserType === 'patient' ? 'default' : 'outline'} onClick={() => setNewUserType('patient')} className="flex-1">Patient</Button>
                <Button variant={newUserType === 'doctor' ? 'default' : 'outline'} onClick={() => setNewUserType('doctor')} className="flex-1">Doctor</Button>
              </div>
              <Button onClick={handleAddUser} className="w-full">Create User</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}