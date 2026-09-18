'use client';

import { useState, useEffect } from 'react';
import { Calendar, FileText, Sparkles, User, UserCheck, Clock } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getAllPatients, PatientRecord } from '../../lib/firestore';
import Link from 'next/link';

const doctorNavItems = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <User size={20} /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Calendar size={20} /> },
  { label: 'Availability', href: '/doctor/availability', icon: <Clock size={20} /> },
  { label: 'Patients Roster', href: '/doctor/patients', icon: <UserCheck size={20} />, active: true },
  { label: 'Clinical Summary Studio', href: '/doctor/clinical-summary', icon: <FileText size={20} /> },
  { label: 'Similar Cases', href: '/doctor/similar-cases', icon: <Sparkles size={20} /> },
  { label: 'Profile & Schedule', href: '/doctor/profile', icon: <User size={20} /> }
];

export function DoctorPatients() {
  const { profile } = useAuth();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
      p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase()) ||
      p.bloodGroup?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DashboardLayout navItems={doctorNavItems} userRole="Doctor" userName={profile?.name || 'Doctor'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Assigned Patients Roster</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                View complete medical histories, previous vitals logs, and EMR records.
              </p>
            </div>
            <div style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Search patient name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: '0.75rem' }}>
              Loading patient roster...
            </div>
          ) : patients.length === 0 ? (
            <div style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: '0.75rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No registered patients found in Firestore database.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.fullName}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>{p.bloodGroup || 'O+'}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <div>Age / Gender: {p.age ? `${p.age} yrs` : 'N/A'} • {p.gender || 'N/A'}</div>
                    <div>Allergies: <strong>{p.allergies || 'None reported'}</strong></div>
                    <div style={{ marginTop: '0.25rem' }}>Medical History: {p.medicalHistory || 'No prior chronic conditions recorded'}</div>
                    <div style={{ marginTop: '0.25rem' }}>Emergency Contact: {p.emergencyContact || 'Not provided'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <Link href={`/doctor/patient/${p.id}`} style={{ width: '100%' }}>
                      <Button variant="outline" fullWidth size="sm">Open Full Patient EMR</Button>
                    </Link>
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
