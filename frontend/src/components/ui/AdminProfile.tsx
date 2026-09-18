'use client';

import { useState } from 'react';
import { BarChart, Calendar, CheckCircle2, LayoutDashboard, Save, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Manage Patients', href: '/admin/patients', icon: <Users size={20} /> },
  { label: 'Manage Doctors', href: '/admin/doctors', icon: <UserCheck size={20} /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} /> },
  { label: 'Analytics & AI', href: '/admin/analytics', icon: <BarChart size={20} /> },
  { label: 'System Settings', href: '/admin/profile', icon: <ShieldCheck size={20} />, active: true }
];

export function AdminProfile() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    adminName: 'Super Admin',
    adminEmail: 'admin@medintel.hospital',
    aiModel: 'Gemini 3 Pro Healthcare (HIPAA Compliant)',
    auditLogging: true,
    maxSlotBookingDays: '30',
    emergencyOverrideCode: 'MED-9912-EMG'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout navItems={adminNavItems} userRole="Admin" userName="Admin User">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>System Settings & Security Controls</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Manage system security, AI model provider endpoints, and access logs.</p>
        </div>

        <form onSubmit={handleSave} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Administrator Name</label>
              <input type="text" value={settings.adminName} onChange={(e) => setSettings({ ...settings, adminName: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Administrator Contact Email</label>
              <input type="email" value={settings.adminEmail} onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Active AI Engine Model</label>
              <select value={settings.aiModel} onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                <option>Gemini 3 Pro Healthcare (HIPAA Compliant)</option>
                <option>MedIntel Clinical Vector Engine v2</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Max Advance Booking Days</label>
              <input type="text" value={settings.maxSlotBookingDays} onChange={(e) => setSettings({ ...settings, maxSlotBookingDays: e.target.value })} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            {saved && (
              <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> System settings updated!
              </span>
            )}
            <Button type="submit">
              <Save size={16} /> Save Security Configuration
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
