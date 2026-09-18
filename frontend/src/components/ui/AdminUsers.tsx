'use client';

import { useState, useEffect } from 'react';
import { BarChart, Calendar, LayoutDashboard, ShieldCheck, Stethoscope, Users, UserX, UserCheck } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, toggleUserActiveStatus, updateUserRole, UserProfile } from '../../lib/firestore';
import { adminNavItems } from '../layout/adminNavItems';

export function AdminUsers() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (uid: string, currentStatus: boolean | undefined) => {
    try {
      const newStatus = currentStatus === false ? true : false;
      await toggleUserActiveStatus(uid, newStatus);
      await fetchUsers();
    } catch (err) {
      console.error('Error toggling user active status:', err);
    }
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      await updateUserRole(uid, newRole);
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName={profile?.name || 'Admin Operator'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>User Directory & Role Management</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                View and manage registered user profiles, toggle active status, and modify role permissions.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '300px',
                padding: '0.6rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading user accounts...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>No user accounts found matching your query.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>User Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Current Role</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.uid} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{u.name || 'Anonymous User'}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={u.role || 'PATIENT'}
                          onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                          style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.8.5rem',
                            background: 'white',
                          }}
                        >
                          <option value="PATIENT">PATIENT</option>
                          <option value="DOCTOR">DOCTOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: u.isActive !== false ? '#f0fdf4' : '#fef2f2',
                            color: u.isActive !== false ? '#166534' : '#991b1b',
                          }}
                        >
                          {u.isActive !== false ? <UserCheck size={12} /> : <UserX size={12} />}
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <Button
                          variant={u.isActive !== false ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleActive(u.uid, u.isActive)}
                        >
                          {u.isActive !== false ? 'Suspend User' : 'Activate User'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
