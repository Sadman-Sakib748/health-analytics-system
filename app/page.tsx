// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import LoginView from '@/components/auth/login-view'
import PatientPortal from '@/components/portals/patient-portal'
import DoctorPortal from '@/components/portals/doctor-portal'
import AdminPortal from '@/components/portals/admin-portal'


export type UserRole = 'patient' | 'doctor' | 'admin' | null

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const savedRole = localStorage.getItem('healthsync_user_role') as UserRole
    const savedName = localStorage.getItem('healthsync_user_name')
    if (savedRole && savedName) {
      setUserRole(savedRole)
      setUserName(savedName)
    }
  }, [])

  const handleLogin = (role: Exclude<UserRole, null>, name: string) => {
    setUserRole(role)
    setUserName(name)
    localStorage.setItem('healthsync_user_role', role)
    localStorage.setItem('healthsync_user_name', name)
  }

  const handleLogout = () => {
    setUserRole(null)
    setUserName('')
    localStorage.removeItem('healthsync_user_role')
    localStorage.removeItem('healthsync_user_name')
  }

  if (!userRole) {
    return <LoginView onLogin={handleLogin} />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">HealthSync</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Health Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-background">
        {userRole === 'patient' && <PatientPortal userName={userName} />}
        {userRole === 'doctor' && <DoctorPortal userName={userName} />}
        {userRole === 'admin' && <AdminPortal userName={userName} />}
      </main>
    </div>
  )
}