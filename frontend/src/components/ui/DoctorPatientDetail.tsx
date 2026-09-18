'use client';

import { Activity, ArrowLeft, Calendar, FileText, Heart, ShieldAlert, Sparkles, User } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import Link from 'next/link';

const doctorNavItems = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <User size={20} /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Calendar size={20} /> },
  { label: 'Patients Roster', href: '/doctor/patients', icon: <User size={20} />, active: true },
  { label: 'Clinical Summary Studio', href: '/doctor/clinical-summary', icon: <FileText size={20} /> },
  { label: 'Similar Cases', href: '/doctor/similar-cases', icon: <Sparkles size={20} /> }
];

export function DoctorPatientDetail({ patientId }: { patientId: string }) {
  return (
    <DashboardLayout navItems={doctorNavItems} userRole="Doctor" userName="Dr. Marcus Vance, MD">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Link href="/doctor/patients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Patients Directory
        </Link>

        {/* Patient Profile Card */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--color-text-main)' }}>Patient EMR Chart: John Doe ({patientId || 'P-101'})</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>45 yrs • Male • Blood Group O+ • Allergy: Penicillin</p>
          </div>
          <Link href="/doctor/clinical-summary">
            <Button variant="primary">
              <Sparkles size={16} /> Launch SOAP AI Studio
            </Button>
          </Link>
        </div>

        {/* Vitals History */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--color-primary)" /> Latest Intake Vitals (Recorded by Nurse Intake Desk)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'var(--color-background)', padding: '0.85rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Blood Pressure</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>138 / 88 mmHg</div>
            </div>
            <div style={{ background: 'var(--color-background)', padding: '0.85rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Heart Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>82 bpm</div>
            </div>
            <div style={{ background: 'var(--color-background)', padding: '0.85rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Oxygen (SpO2)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>98%</div>
            </div>
            <div style={{ background: 'var(--color-background)', padding: '0.85rem', borderRadius: '0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>BMI</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>24.8 kg/m²</div>
            </div>
          </div>
        </div>

        {/* Clinical Notes Timeline */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Historical Visit Summaries</h2>
          <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Aug 24, 2026 — Cardiology Evaluation</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Subjective: Recurrent exertional chest pressure for 3 days. Objective: BP 138/88, EKG normal sinus rhythm. Plan: Ordered stress echocardiogram and dietary counseling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
