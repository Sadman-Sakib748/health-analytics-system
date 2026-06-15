'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type UserRole = 'patient' | 'doctor' | 'admin' | null

interface LoginViewProps {
  onLogin: (role: Exclude<UserRole, null>, name: string) => void
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, null> | null>(null)
  const [userName, setUserName] = useState('')

  const roles = [
    { id: 'patient' as const, title: 'Patient Portal', description: 'Manage your prescriptions and health records', icon: '👤', color: 'from-blue-500/10' },
    { id: 'doctor' as const, title: 'Doctor Portal', description: 'View patient data and prescribe medications', icon: '👨‍⚕️', color: 'from-green-500/10' },
    { id: 'admin' as const, title: 'Admin Portal', description: 'System management and user control', icon: '⚙️', color: 'from-purple-500/10' }
  ]

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-white">H</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">HealthSync</h1>
            <p className="text-muted-foreground">AI-Powered Prescription Management</p>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
          <div className="space-y-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-gradient-to-br ${role.color} transition-all text-left`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{role.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const roleInfo = roles.find(r => r.id === selectedRole)!
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl">{roleInfo.icon}</span>
            <h2 className="text-2xl font-bold mt-3">{roleInfo.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{roleInfo.description}</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (userName.trim()) onLogin(selectedRole, userName); }}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <div className="space-y-3">
              <Button type="submit" disabled={!userName.trim()} className="w-full">Continue</Button>
              <Button type="button" onClick={() => setSelectedRole(null)} variant="outline" className="w-full">Back</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}