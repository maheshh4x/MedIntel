'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, FileText, Filter, Sparkles, User } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAppointments, AppointmentRecord, updateAppointmentStatus } from '../../lib/firestore';
import Link from 'next/link';

const doctorNavItems = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <User size={20} /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Calendar size={20} />, active: true },
  { label: 'Availability', href: '/doctor/availability', icon: <Clock size={20} /> },
  { label: 'Patients Roster', href: '/doctor/patients', icon: <User size={20} /> },
  { label: 'Clinical Summary Studio', href: '/doctor/clinical-summary', icon: <FileText size={20} /> },
  { label: 'Similar Cases', href: '/doctor/similar-cases', icon: <Sparkles size={20} /> },
  { label: 'Profile & Schedule', href: '/doctor/profile', icon: <User size={20} /> }
];

export function DoctorAppointments() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const fetchAppts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getDoctorAppointments(user.uid);
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppts();
  }, [user]);

  const filtered = appointments.filter(
    (a) => filterStatus === 'All' || a.status === filterStatus
  );

  const toggleStatus = async (id: string, currentStatus: AppointmentRecord['status']) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'SCHEDULED' : 'COMPLETED';
    try {
      await updateAppointmentStatus(id, nextStatus);
      await fetchAppts();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DashboardLayout navItems={doctorNavItems} userRole="Doctor" userName={profile?.name || 'Doctor'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Consultation Appointments</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Real-time booking schedule populated from Firestore.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Filter size={16} color="var(--color-text-muted)" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="WAITING">Waiting</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: '0.75rem' }}>
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: '0.75rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No appointments booked yet. Make sure your consultation availability schedule is configured under <Link href="/doctor/availability" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Availability</Link>.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{apt.patientName}</span>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: apt.status === 'COMPLETED' ? '#f0fdf4' : '#eff6ff',
                          color: apt.status === 'COMPLETED' ? '#166534' : '#1e40af'
                        }}
                      >
                        Status: {apt.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Date: <strong>{apt.date}</strong> • Time: <strong>{apt.startTime} - {apt.endTime}</strong> • Symptoms: <em>{apt.symptoms || 'General Consultation'}</em>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link href={`/doctor/patient/${apt.patientId}`}>
                      <Button variant="outline" size="sm">View EMR Chart</Button>
                    </Link>
                    <Link href="/doctor/clinical-summary">
                      <Button variant="primary" size="sm">Open SOAP Studio</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(apt.id!, apt.status)}>
                      {apt.status === 'COMPLETED' ? <CheckCircle2 size={18} color="var(--color-success)" /> : <Clock size={18} color="var(--color-text-muted)" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
