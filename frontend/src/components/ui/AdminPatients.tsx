'use client';

import { useState, useEffect } from 'react';
import { BarChart, Calendar, LayoutDashboard, ShieldCheck, UserCheck, Users, Stethoscope } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getAllPatients, PatientRecord } from '../../lib/firestore';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'User Directory & Roles', href: '/admin/users', icon: <ShieldCheck size={20} /> },
  { label: 'Manage Patients', href: '/admin/patients', icon: <Users size={20} />, active: true },
  { label: 'Manage Doctors', href: '/admin/doctors', icon: <Stethoscope size={20} /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart size={20} /> },
];

export function AdminPatients() {
  const { profile } = useAuth();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      setLoading(true);
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.bloodGroup && p.bloodGroup.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName={profile?.name || 'Admin Operator'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>System Patients Registry</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                View all registered patient health records, blood groups, and emergency contacts in Firestore.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search patient name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '280px',
                padding: '0.6rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading patient database...</div>
            ) : patients.length === 0 ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>No patient profiles registered in Firestore.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Patient Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Age / Gender</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Blood Group</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Emergency Contact</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Known Allergies</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.patientId} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{p.fullName}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>{p.email}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{p.age} yrs • {p.gender}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{p.bloodGroup || 'N/A'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{p.emergencyContact || 'Not recorded'}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>{p.allergies || 'NKDA'}</td>
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
