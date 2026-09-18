'use client';

import { useState, useEffect } from 'react';
import { BarChart, Calendar, CheckCircle2, LayoutDashboard, ShieldCheck, Stethoscope, Users, XCircle, Plus } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { getAllDoctors, updateDoctorProfile, DoctorProfile } from '../../lib/firestore';
import { adminCreateDoctor } from '../../lib/admin';
import { adminNavItems } from '../layout/adminNavItems';

export function AdminDoctors() {
  const { profile } = useAuth();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    department: '',
    licenseNumber: '',
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const toggleVerify = async (doc: DoctorProfile) => {
    try {
      await updateDoctorProfile(doc.uid, { verified: !doc.verified });
      await fetchDoctors();
    } catch (err) {
      console.error('Error updating doctor verification status:', err);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateDoctor(
        form.email,
        form.password,
        form.name,
        {
          specialization: form.specialization,
          department: form.department,
          licenseNumber: form.licenseNumber,
        }
      );
      setShowModal(false);
      setForm({ name: '', email: '', password: '', specialization: '', department: '', licenseNumber: '' });
      await fetchDoctors();
    } catch (err) {
      console.error('Failed to create doctor:', err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName={profile?.name || 'Admin Operator'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Medical Staff & Doctor Roster</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Verify physician credentials, assign departments, and audit clinical permissions saved in Firestore.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Add New Doctor
            </Button>
          </div>

          {/* Modal */}
          {showModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '0.75rem', width: '400px' }}>
                <h2 style={{ marginBottom: '1rem' }}>Create Doctor Account</h2>
                <form onSubmit={handleCreateDoctor}>
                  <input name="name" placeholder="Full Name" value={form.name} onChange={handleInput} required style={inputStyle} />
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleInput} required style={inputStyle} />
                  <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleInput} required style={inputStyle} />
                  <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleInput} style={inputStyle} />
                  <input name="department" placeholder="Department" value={form.department} onChange={handleInput} style={inputStyle} />
                  <input name="licenseNumber" placeholder="License Number" value={form.licenseNumber} onChange={handleInput} style={inputStyle} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)} size="sm">Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">Create</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Loading doctor database...</div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
                No doctor profiles found in Firestore. Promote users to DOCTOR role under User Directory.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Doctor Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Specialty</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Department</th>
                    <th style={{ padding: '0.85rem 1rem' }}>License No.</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Verification</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d.uid} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{d.fullName}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{d.specialization || 'General'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{d.department || 'Outpatient'}</td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace' }}>{d.licenseNumber || 'Pending'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, background: d.verified ? '#f0fdf4' : '#fffbe6', color: d.verified ? '#166534' : '#b45309' }}>
                          {d.verified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {d.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <Button variant={d.verified ? 'outline' : 'primary'} size="sm" onClick={() => toggleVerify(d)}>
                          {d.verified ? 'Revoke Approval' : 'Approve Credentials'}
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

// Inline style for inputs to keep the file self‑contained and premium
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  marginBottom: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--color-border)',
  fontSize: '0.85rem',
};
