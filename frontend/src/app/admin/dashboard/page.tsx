'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { LayoutDashboard, Users, Calendar, BarChart, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { getAllUsers, getAllActiveDoctors, getAllPatients, getAllAppointments, UserProfile, DoctorProfile, PatientRecord, AppointmentRecord } from '../../../lib/firestore';
import styles from '../../patient/dashboard/dashboard.module.css';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [uList, dList, pList, aList] = await Promise.all([
          getAllUsers(),
          getAllActiveDoctors(),
          getAllPatients(),
          getAllAppointments(),
        ]);
        setUsers(uList);
        setDoctors(dList);
        setPatients(pList);
        setAppointments(aList);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin/dashboard', active: true },
    { icon: <ShieldCheck size={20} />, label: 'User Directory & Roles', href: '/admin/users' },
    { icon: <Users size={20} />, label: 'Manage Patients', href: '/admin/patients' },
    { icon: <Stethoscope size={20} />, label: 'Manage Doctors', href: '/admin/doctors' },
    { icon: <Calendar size={20} />, label: 'System Appointments', href: '/admin/appointments' },
    { icon: <BarChart size={20} />, label: 'Analytics', href: '/admin/analytics' },
  ];

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={navItems} userRole="Admin" userName={profile?.name || 'Admin Operator'}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>System Control & Administration</h1>
            <p className={styles.subtitle}>Real-time system telemetry and role management across MedIntel.</p>
          </div>
          <Link href="/admin/users">
            <Button variant="primary">
              <UserCheck size={18} /> Manage User Roles
            </Button>
          </Link>
        </div>

        <div className={styles.metricGrid} style={{ marginBottom: '2rem' }}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Total Registered Users</div>
            <div className={styles.metricValue}>{loading ? '...' : users.length}</div>
            <div className={styles.metricStatus}>Accounts in Firestore</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Total Patients</div>
            <div className={styles.metricValue}>{loading ? '...' : patients.length}</div>
            <div className={styles.metricStatus}>Medical Profiles</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>Active Doctors</div>
            <div className={styles.metricValue}>{loading ? '...' : doctors.length}</div>
            <div className={styles.metricStatus}>Verified Physicians</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>System Appointments</div>
            <div className={styles.metricValue}>{loading ? '...' : appointments.length}</div>
            <div className={styles.metricStatus}>Total Bookings Recorded</div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Administrative Action Center</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Role Management & Permissions</h3>
            <p className={styles.cardDesc}>Promote users, assign doctor/admin privileges, and toggle active status.</p>
            <Link href="/admin/users">
              <Button variant="outline" fullWidth style={{ marginTop: 'auto' }}>Open User Directory</Button>
            </Link>
          </div>

          <div className={styles.card}>
            <h3>Doctor Roster & Credentials</h3>
            <p className={styles.cardDesc}>Provision physician accounts, review license numbers, and set departments.</p>
            <Link href="/admin/doctors">
              <Button variant="outline" fullWidth style={{ marginTop: 'auto' }}>Manage Doctor Profiles</Button>
            </Link>
          </div>

          <div className={styles.card}>
            <h3>Appointment Audit Log</h3>
            <p className={styles.cardDesc}>Monitor clinical consultation schedules, cancellations, and status logs.</p>
            <Link href="/admin/appointments">
              <Button variant="outline" fullWidth style={{ marginTop: 'auto' }}>Audit Appointments</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
