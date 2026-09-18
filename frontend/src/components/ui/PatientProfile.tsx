'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, FileText, Heart, Save, User, Calendar } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getPatientProfile, updatePatientProfile, PatientRecord } from '../../lib/firestore';
import styles from './PatientProfile.module.css';

const patientNavItems = [
  { label: 'Dashboard', href: '/patient/dashboard', icon: <Activity size={20} /> },
  { label: 'Appointments', href: '/patient/appointments', icon: <Calendar size={20} /> },
  { label: 'Medical Reports', href: '/patient/reports', icon: <FileText size={20} /> },
  { label: 'Health Trends', href: '/patient/trends', icon: <Activity size={20} /> },
  { label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker', icon: <Activity size={20} /> },
  { label: 'Profile Settings', href: '/patient/profile', icon: <User size={20} />, active: true }
];

export function PatientProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<PatientRecord>>({
    fullName: '',
    email: '',
    phone: '',
    age: 30,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getPatientProfile(user.uid);
        if (data) {
          setFormData(data);
        } else if (profile) {
          setFormData((prev) => ({ ...prev, fullName: profile.name, email: profile.email }));
        }
      } catch (err) {
        console.error('Error fetching patient profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updatePatientProfile(user.uid, formData);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving patient profile:', err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <DashboardLayout navItems={patientNavItems} userRole="Patient" userName={formData.fullName || profile?.name || 'Patient'}>
        <div className={styles.container}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Patient Profile & EMR Preferences</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Manage your contact information, blood group, allergies, and emergency numbers saved in Firestore.
            </p>
          </div>

          {loading ? (
            <div className={styles.card}><p>Loading profile details...</p></div>
          ) : (
            <form onSubmit={handleSave}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <User size={20} color="var(--color-primary)" /> Personal Details
                </h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled style={{ background: '#f1f5f9' }} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Age (Years)</label>
                    <input type="number" value={formData.age || 0} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Gender</label>
                    <select value={formData.gender || 'Male'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Blood Group</label>
                    <select value={formData.bloodGroup || 'O+'} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '1.5rem' }}>
                <h2 className={styles.cardTitle}>
                  <Heart size={20} color="var(--color-primary)" /> Medical Background & Emergency Contact
                </h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Known Allergies (NKDA if none)</label>
                    <input type="text" value={formData.allergies || ''} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} placeholder="e.g. Penicillin, Peanuts" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Emergency Contact</label>
                    <input type="text" value={formData.emergencyContact || ''} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} placeholder="Name and phone number" />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label>Medical History / Pre-existing Conditions</label>
                  <textarea rows={3} value={formData.medicalHistory || ''} onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} placeholder="e.g. Mild Hypertension, Asthma in childhood" style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem', alignItems: 'center' }}>
                {saved && (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <CheckCircle2 size={18} /> Patient record updated in Firestore!
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
