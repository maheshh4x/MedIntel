'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { LayoutDashboard, Calendar, Activity, FileText, TrendingUp, MessageSquare, Plus, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { getPatientAppointments, AppointmentRecord, getPatientProfile, PatientRecord } from '../../../lib/firestore';
import styles from './dashboard.module.css';

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [patientData, setPatientData] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        const [appts, pData] = await Promise.all([
          getPatientAppointments(user.uid),
          getPatientProfile(user.uid),
        ]);
        setAppointments(appts);
        setPatientData(pData);
      } catch (err) {
        console.error('Error loading patient dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/patient/dashboard', active: true },
    { icon: <Calendar size={20} />, label: 'Appointments', href: '/patient/appointments' },
    { icon: <Activity size={20} />, label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker' },
    { icon: <FileText size={20} />, label: 'Medical Reports', href: '/patient/reports' },
    { icon: <TrendingUp size={20} />, label: 'Health Trends', href: '/patient/trends' },
    { icon: <MessageSquare size={20} />, label: 'AI Assistant', href: '/patient/assistant' },
  ];

  const upcomingAppt = appointments.find((a) => a.status === 'SCHEDULED' || a.status === 'WAITING');

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <DashboardLayout navItems={navItems} userRole="Patient" userName={profile?.name || 'Patient'}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome back, {profile?.name || 'Patient'} 👋</h1>
            <p className={styles.subtitle}>Here is an overview of your health profile and upcoming appointments.</p>
          </div>
          <Link href="/patient/appointments">
            <Button variant="primary">
              <Plus size={18} /> Book Appointment
            </Button>
          </Link>
        </div>

        <div className={styles.grid}>
          {/* Upcoming Appointment Card */}
          <div className={`${styles.card} ${styles.primaryCard}`}>
            <h3>Next Scheduled Visit</h3>
            {loading ? (
              <p style={{ color: 'white' }}>Loading upcoming visit details...</p>
            ) : upcomingAppt ? (
              <div className={styles.appointmentDetails}>
                <div className={styles.docInfo}>
                  <strong>{upcomingAppt.doctorName}</strong>
                  <span>Status: {upcomingAppt.status}</span>
                </div>
                <div className={styles.timeInfo}>
                  <span>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                    {upcomingAppt.date} at {upcomingAppt.startTime}
                  </span>
                  <span>Symptoms: {upcomingAppt.symptoms}</span>
                </div>
              </div>
            ) : (
              <div style={{ margin: '1rem 0' }}>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
                  No upcoming appointments scheduled.
                </p>
              </div>
            )}
            <div className={styles.actions}>
              <Link href="/patient/appointments">
                <Button variant="secondary" size="sm">
                  {upcomingAppt ? 'View Schedule / Book' : 'Schedule Visit Now'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Access */}
          <div className={styles.card}>
            <h3>AI Symptom Checker</h3>
            <p className={styles.cardDesc}>Not feeling well? Describe your symptoms for AI triage.</p>
            <Link href="/patient/ai-symptom-checker" style={{ marginTop: 'auto' }}>
              <Button variant="outline" fullWidth>Start Check</Button>
            </Link>
          </div>

          <div className={styles.card}>
            <h3>Medical File Storage</h3>
            <p className={styles.cardDesc}>Upload lab results and access cloud medical records.</p>
            <Link href="/patient/reports" style={{ marginTop: 'auto' }}>
              <Button variant="outline" fullWidth>Manage Records</Button>
            </Link>
          </div>
        </div>

        {/* Health Overview */}
        <h2 className={styles.sectionTitle}>Health Profile Snapshot</h2>
        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Blood Group</div>
            <div className={styles.metricValue}>{patientData?.bloodGroup || 'Not set'}</div>
            <div className={styles.metricStatus}>Recorded in EMR</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Known Allergies</div>
            <div className={styles.metricValue}>{patientData?.allergies ? 'Present' : 'None'}</div>
            <div className={styles.metricStatus}>{patientData?.allergies || 'NKDA'}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Age / Gender</div>
            <div className={styles.metricValue}>
              {patientData?.age ? `${patientData.age} yrs` : 'N/A'}
            </div>
            <div className={styles.metricStatus}>{patientData?.gender || 'Unspecified'}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Emergency Contact</div>
            <div className={styles.metricValue} style={{ fontSize: '1rem', wordBreak: 'break-all' }}>
              {patientData?.emergencyContact || 'Not set'}
            </div>
            <div className={styles.metricStatus}>On File</div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
