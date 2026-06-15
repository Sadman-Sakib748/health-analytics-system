'use client'

import { useState } from 'react'
import { Trash2, Edit2, Plus, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SystemUser {
  id: string
  name: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  status: 'active' | 'inactive'
  joinDate: string
  lastActive: string
}

interface UserManagementProps {
  users: SystemUser[]
  onAddUser: () => void
  onEditUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
}

export default function UserManagement({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UserManagementProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive'
      case 'doctor':
        return 'bg-primary/10 text-primary'
      case 'patient':
        return 'bg-secondary/10 text-secondary'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-500/20 text-green-700'
      : 'bg-red-500/20 text-red-700'
  }

  if (users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={onAddUser} className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
        <div className="p-8 text-center bg-card rounded-lg border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No users yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">System Users</h3>
        <Button onClick={onAddUser} className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Last Active</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-card/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.joinDate}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastActive}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditUser(user.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {deleteConfirm === user.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            onDeleteUser(user.id)
                            setDeleteConfirm(null)
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirm(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
