'use client'

import { Users, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Patient {
  id: string
  name: string
  email: string
  age: number
  lastVisit: string
  condition: string
  prescriptionCount: number
}

interface PatientListProps {
  patients: Patient[]
  onViewDetails: (patientId: string) => void
}

export default function PatientList({ patients, onViewDetails }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-lg border border-border">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No patients assigned yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Age</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Condition</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Prescriptions</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Last Visit</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b border-border hover:bg-card/50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.email}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">{patient.age}</td>
              <td className="px-4 py-3 text-foreground">{patient.condition}</td>
              <td className="px-4 py-3">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  {patient.prescriptionCount}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{patient.lastVisit}</td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(patient.id)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
