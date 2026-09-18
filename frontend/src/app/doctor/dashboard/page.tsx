'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { LayoutDashboard, Users, Calendar, FileText, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { getDoctorAppointments, AppointmentRecord, updateAppointmentStatus } from '../../../lib/firestore';
import styles from '../../patient/dashboard/dashboard.module.css';

export default function DoctorDashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getDoctorAppointments(user.uid);
      setAppointments(data);
    } catch (err) {
      console.error('Error loading doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleStatusChange = async (apptId: string, status: AppointmentRecord['status']) => {
    try {
      await updateAppointmentStatus(apptId, status);
      await fetchAppointments();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/doctor/dashboard', active: true },
    { icon: <Calendar size={20} />, label: 'Appointments', href: '/doctor/appointments' },
    { icon: <Clock size={20} />, label: 'Availability', href: '/doctor/availability' },
    { icon: <Users size={20} />, label: 'Patients', href: '/doctor/patients' },
    { icon: <FileText size={20} />, label: 'Clinical Summary', href: '/doctor/clinical-summary' },
    { icon: <Activity size={20} />, label: 'Similar Cases', href: '/doctor/similar-cases' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.date === todayStr || a.status === 'SCHEDULED');
  const waitingAppts = appointments.filter((a) => a.status === 'WAITING' || a.status === 'SCHEDULED');
  const completedAppts = appointments.filter((a) => a.status === 'COMPLETED');

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DashboardLayout navItems={navItems} userRole="Doctor" userName={profile?.name || 'Dr. Practitioner'}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome back, {profile?.name || 'Doctor'}</h1>
            <p className={styles.subtitle}>
              You have {todayAppts.length} active appointment(s) in your workbench queue.
            </p>
          </div>
          <Link href="/doctor/availability">
            <Button variant="outline"><Clock size={16} /> Manage Availability</Button>
          </Link>
        </div>

        <div className={styles.metricGrid} style={{ marginBottom: '2rem' }}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Total Appointments</div>
            <div className={styles.metricValue}>{appointments.length}</div>
            <div className={styles.metricStatus}>Recorded in System</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Waiting / Scheduled</div>
            <div className={styles.metricValue}>{waitingAppts.length}</div>
            <div className={styles.metricStatus}>Pending Consultations</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Completed</div>
            <div className={styles.metricValue}>{completedAppts.length}</div>
            <div className={styles.metricStatus}>Completed Visits</div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Assigned Appointments Workbench</h2>

        {loading ? (
          <div className={styles.card}><p>Loading appointments from Firestore...</p></div>
        ) : appointments.length === 0 ? (
          <div className={styles.card} style={{ textAlign: 'center', padding: '2rem' }}>
            <Calendar size={36} color="var(--color-text-muted)" style={{ marginBottom: '0.5rem' }} />
            <p>No appointments booked with your account yet.</p>
            <Link href="/doctor/availability">
              <Button size="sm"><Clock size={16} /> Configure Availability so Patients Can Book</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {appointments.map((appt) => (
              <div key={appt.id} className={styles.card} style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{appt.startTime}</span>
                  <span className={styles.metricStatus} style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: appt.status === 'COMPLETED' ? '#f0fdf4' : '#eff6ff',
                    color: appt.status === 'COMPLETED' ? '#166534' : '#1e40af'
                  }}>
                    {appt.status}
                  </span>
                </div>

                <div className={styles.appointmentDetails}>
                  <div className={styles.docInfo}>
                    <strong style={{ fontSize: '1.05rem' }}>{appt.patientName}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      Date: {appt.date}
                    </span>
                  </div>
                  <div className={styles.timeInfo}>
                    <span>Symptoms: {appt.symptoms || 'General Checkup'}</span>
                  </div>
                </div>

                <div className={styles.actions} style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {appt.status !== 'COMPLETED' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(appt.id!, 'COMPLETED')}
                    >
                      <CheckCircle2 size={16} /> Mark Completed
                    </Button>
                  )}
                  {appt.status !== 'CANCELLED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(appt.id!, 'CANCELLED')}
                      style={{ color: 'var(--color-danger)' }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
