'use client';

import { Activity, BarChart, Calendar, LayoutDashboard, ShieldCheck, Sparkles, Stethoscope, Users } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'User Directory & Roles', href: '/admin/users', icon: <ShieldCheck size={20} /> },
  { label: 'Manage Patients', href: '/admin/patients', icon: <Users size={20} /> },
  { label: 'Manage Doctors', href: '/admin/doctors', icon: <Stethoscope size={20} /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart size={20} />, active: true },
];

export function AdminAnalytics() {
  const { profile } = useAuth();
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName={profile?.name || 'Admin Operator'}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>AI Platform Analytics & Operational Metrics</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Track AI clinical summary adoption rates, symptom triage accuracy, and clinic throughput.
            </p>
          </div>

          {/* 4 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>AI Summaries Drafted</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.2rem 0' }}>4,820</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>98.4% Doctor Signoff Rate</div>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Triage Accuracy</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-secondary)', margin: '0.2rem 0' }}>96.2%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Validated vs. EMR outcomes</div>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Avg Wait Time Reduction</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.2rem 0' }}>-18 min</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>With Nurse Intake Desk</div>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>OCR Reports Scanned</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.2rem 0' }}>2,140</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>99.1% Value Accuracy</div>
            </div>
          </div>

          {/* Visual Analytics Chart Placeholder */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" /> Daily AI Utilization & Appointment Throughput
            </h2>

            <svg viewBox="0 0 800 200" style={{ width: '100%', height: '200px' }}>
              <line x1="50" y1="30" x2="750" y2="30" stroke="#f0e6e0" strokeDasharray="4" />
              <line x1="50" y1="90" x2="750" y2="90" stroke="#f0e6e0" strokeDasharray="4" />
              <line x1="50" y1="150" x2="750" y2="150" stroke="#f0e6e0" />

              <polyline fill="none" stroke="var(--color-primary)" strokeWidth="3" points="60,140 160,110 260,95 360,60 460,75 560,40 660,30 740,25" />
              <polyline fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" points="60,145 160,130 260,115 360,90 460,105 560,70 660,60 740,55" />

              <text x="60" y="170" fontSize="11" fill="#9a8c86">Mon</text>
              <text x="160" y="170" fontSize="11" fill="#9a8c86">Tue</text>
              <text x="260" y="170" fontSize="11" fill="#9a8c86">Wed</text>
              <text x="360" y="170" fontSize="11" fill="#9a8c86">Thu</text>
              <text x="460" y="170" fontSize="11" fill="#9a8c86">Fri</text>
              <text x="560" y="170" fontSize="11" fill="#9a8c86">Sat</text>
              <text x="660" y="170" fontSize="11" fill="#9a8c86">Sun</text>
            </svg>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
