'use client';

import { useState, useEffect } from 'react';
import { BarChart, Calendar, LayoutDashboard, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getAllAppointments, updateAppointmentStatus, AppointmentRecord } from '../../lib/firestore';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'User Directory & Roles', href: '/admin/users', icon: <ShieldCheck size={20} /> },
  { label: 'Manage Patients', href: '/admin/patients', icon: <Users size={20} /> },
  { label: 'Manage Doctors', href: '/admin/doctors', icon: <Stethoscope size={20} /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} />, active: true },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart size={20} /> },
];

export function AdminAppointments() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching system appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string | undefined, newStatus: AppointmentRecord['status']) => {
    if (!id) return;
    try {
      await updateAppointmentStatus(id, newStatus);
      await fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment status:', err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName={profile?.name || 'Admin Operator'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Master Appointment Audit Log & Queue</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Monitor hospital-wide appointment schedules, symptoms recorded, and status transitions in Firestore.
            </p>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading appointment records...</div>
            ) : appointments.length === 0 ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>No appointment records found in Firestore.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Patient</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Physician</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Reported Symptoms</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Admin Override</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{a.patientName}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{a.doctorName}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{a.date} at {a.startTime}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>{a.symptoms || 'General Checkup'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background:
                              a.status === 'COMPLETED'
                                ? '#f0fdf4'
                                : a.status === 'IN_PROGRESS'
                                ? '#eff6ff'
                                : a.status === 'CANCELLED'
                                ? '#fef2f2'
                                : '#fffbe6',
                            color:
                              a.status === 'COMPLETED'
                                ? '#166534'
                                : a.status === 'IN_PROGRESS'
                                ? '#1d4ed8'
                                : a.status === 'CANCELLED'
                                ? '#991b1b'
                                : '#b45309',
                          }}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={a.status}
                          onChange={(e) => handleStatusChange(a.id, e.target.value as AppointmentRecord['status'])}
                          style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <option value="SCHEDULED">SCHEDULED</option>
                          <option value="WAITING">WAITING</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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
