'use client';

import { useState } from 'react';
import { Activity, CheckCircle2, ClipboardList, Save, ShieldCheck, User } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';

const staffNavItems = [
  { label: 'Triage & Intake Desk', href: '/staff/intake', icon: <ClipboardList size={20} /> },
  { label: 'Patient Queue Monitor', href: '/staff/dashboard', icon: <Activity size={20} /> },
  { label: 'Profile Settings', href: '/staff/profile', icon: <User size={20} />, active: true }
];

export function StaffProfile() {
  const [saved, setSaved] = useState(false);
  const [staffData, setStaffData] = useState({
    name: 'Clara Barton, RN',
    email: 'clara.barton@medintel.hospital',
    role: 'Senior Triage Nurse / Intake Specialist',
    department: 'Emergency & Triage Intake',
    licenseNo: 'RN-99812-HYD',
    shift: 'Morning Shift (07:00 AM - 03:00 PM)',
    phone: '+91 98765 11223'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout navItems={staffNavItems} userRole="Healthcare Staff" userName="Clara Barton, RN">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>Healthcare Staff Profile & Shift Settings</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Manage your clinical intake desk profile, nursing license, and shift schedule.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Staff Name</label>
              <input type="text" value={staffData.name} onChange={(e) => setStaffData({ ...staffData, name: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Hospital Email</label>
              <input type="email" value={staffData.email} onChange={(e) => setStaffData({ ...staffData, email: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Nursing License Number</label>
              <input type="text" value={staffData.licenseNo} onChange={(e) => setStaffData({ ...staffData, licenseNo: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Hospital Department</label>
              <input type="text" value={staffData.department} onChange={(e) => setStaffData({ ...staffData, department: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Assigned Shift</label>
              <select value={staffData.shift} onChange={(e) => setStaffData({ ...staffData, shift: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                <option>Morning Shift (07:00 AM - 03:00 PM)</option>
                <option>Evening Shift (03:00 PM - 11:00 PM)</option>
                <option>Night Shift (11:00 PM - 07:00 AM)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Contact Phone</label>
              <input type="text" value={staffData.phone} onChange={(e) => setStaffData({ ...staffData, phone: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            {saved && (
              <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> Staff profile updated!
              </span>
            )}
            <Button type="submit">
              <Save size={16} /> Save Profile Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
