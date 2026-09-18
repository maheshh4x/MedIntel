'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, FileText, Save, Sparkles, User, Clock } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getDoctorProfile, updateDoctorProfile, DoctorProfile as DoctorProfileType } from '../../lib/firestore';

const doctorNavItems = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <User size={20} /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Calendar size={20} /> },
  { label: 'Availability', href: '/doctor/availability', icon: <Clock size={20} /> },
  { label: 'Patients Roster', href: '/doctor/patients', icon: <User size={20} /> },
  { label: 'Clinical Summary Studio', href: '/doctor/clinical-summary', icon: <FileText size={20} /> },
  { label: 'Similar Cases', href: '/doctor/similar-cases', icon: <Sparkles size={20} /> },
  { label: 'Profile & Schedule', href: '/doctor/profile', icon: <User size={20} />, active: true }
];

export function DoctorProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docData, setDocData] = useState<Partial<DoctorProfileType>>({
    fullName: '',
    specialization: 'General Medicine',
    licenseNumber: '',
    department: 'Outpatient Care',
    consultationDuration: 20,
    experience: '5 years',
    qualification: 'MD',
    bio: '',
    hospitalInfo: 'MedIntel Central',
    contactInfo: '',
  });

  useEffect(() => {
    async function loadDoctor() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getDoctorProfile(user.uid);
        if (data) {
          setDocData(data);
        } else if (profile) {
          setDocData((prev) => ({ ...prev, fullName: profile.name, email: profile.email }));
        }
      } catch (err) {
        console.error('Error loading doctor profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoctorProfile(user.uid, docData);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving doctor profile:', err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DashboardLayout navItems={doctorNavItems} userRole="Doctor" userName={docData.fullName || profile?.name || 'Doctor'}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Physician Profile & Credentials</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Update your specialization, hospital department, license number, and professional bio.</p>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: '0.75rem' }}>
              Loading profile data...
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Full Physician Name</label>
                  <input type="text" value={docData.fullName || ''} onChange={(e) => setDocData({ ...docData, fullName: e.target.value })} required style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Specialty / Discipline</label>
                  <input type="text" value={docData.specialization || ''} onChange={(e) => setDocData({ ...docData, specialization: e.target.value })} required style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Medical License Number</label>
                  <input type="text" value={docData.licenseNumber || ''} onChange={(e) => setDocData({ ...docData, licenseNumber: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Hospital Department</label>
                  <input type="text" value={docData.department || ''} onChange={(e) => setDocData({ ...docData, department: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Experience (Years)</label>
                  <input type="text" value={docData.experience || ''} onChange={(e) => setDocData({ ...docData, experience: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Default Appointment Duration (Minutes)</label>
                  <select value={docData.consultationDuration || 20} onChange={(e) => setDocData({ ...docData, consultationDuration: Number(e.target.value) })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Professional Biography</label>
                <textarea rows={3} value={docData.bio || ''} onChange={(e) => setDocData({ ...docData, bio: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                {saved && (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <CheckCircle2 size={18} /> Doctor profile saved to Firestore!
                  </span>
                )}
                <Button type="submit">
                  <Save size={16} /> Save Profile Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
