'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Activity, BarChart3, Calendar, FileText, LayoutDashboard, MessageSquare, Search, Users } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '../ui/Button';
import styles from '../../app/patient/dashboard/dashboard.module.css';

type Role = 'Patient' | 'Doctor' | 'Admin';

interface WorkspaceRow {
  primary: string;
  secondary: string;
  status: string;
  detail: string;
}

interface RoleWorkspaceProps {
  role: Role;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionHref?: string;
  stats: Array<{ label: string; value: string; status: string }>;
  rows: WorkspaceRow[];
  emptyLabel?: string;
}

const navByRole = {
  Patient: [
    ['Dashboard', '/patient/dashboard', LayoutDashboard], ['Appointments', '/patient/appointments', Calendar],
    ['AI Symptom Checker', '/patient/ai-symptom-checker', Activity], ['Medical Reports', '/patient/reports', FileText],
    ['Health Trends', '/patient/trends', BarChart3], ['AI Assistant', '/patient/assistant', MessageSquare],
  ],
  Doctor: [
    ['Dashboard', '/doctor/dashboard', LayoutDashboard], ['Appointments', '/doctor/appointments', Calendar],
    ['Patients', '/doctor/patients', Users], ['Clinical Summary', '/doctor/clinical-summary', FileText],
    ['Similar Cases', '/doctor/similar-cases', Activity],
  ],
  Admin: [
    ['Dashboard', '/admin/dashboard', LayoutDashboard], ['Manage Patients', '/admin/patients', Users],
    ['Manage Doctors', '/admin/doctors', Users], ['Appointments', '/admin/appointments', Calendar],
    ['Analytics', '/admin/analytics', BarChart3],
  ],
} as const;

const names = { Patient: 'Mahesh', Doctor: 'Dr. Sarah Chen', Admin: 'Admin User' };

export function RoleWorkspace({ role, title, subtitle, actionLabel, actionHref, stats, rows, emptyLabel = 'No matching records' }: RoleWorkspaceProps) {
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [notice, setNotice] = useState('');
  const statuses = ['All', ...Array.from(new Set(rows.map((row) => row.status)))];
  const filteredRows = useMemo(() => rows.filter((row) => {
    const matchesQuery = `${row.primary} ${row.secondary} ${row.detail}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (selectedStatus === 'All' || row.status === selectedStatus);
  }), [query, rows, selectedStatus]);
  const navItems = navByRole[role].map(([label, href, Icon]) => ({ icon: <Icon size={20} />, label, href, active: href === `/${role.toLowerCase()}${title === 'Patient Appointments' || title === 'Doctor Appointments' || title === 'System Appointments' ? '/appointments' : ''}` }));

  return (
    <DashboardLayout navItems={navItems} userRole={role} userName={names[role]}>
      <div className={styles.header}>
        <div><h1 className={styles.title}>{title}</h1><p className={styles.subtitle}>{subtitle}</p></div>
        {actionHref ? <Link href={actionHref}><Button>{actionLabel}</Button></Link> : <Button onClick={() => setNotice(`${actionLabel} is ready for your next step.`)}>{actionLabel}</Button>}
      </div>
      {notice && <div className={styles.card} style={{ marginBottom: '1.5rem', color: 'var(--color-success)' }}>{notice}</div>}
      <div className={styles.metricGrid} style={{ marginBottom: '2rem' }}>
        {stats.map((stat) => <div className={styles.metricCard} key={stat.label}><div className={styles.metricHeader}>{stat.label}</div><div className={styles.metricValue}>{stat.value}</div><div className={styles.metricStatus}>{stat.status}</div></div>)}
      </div>
      <div className={styles.card}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.8rem' }}>
            <Search size={17} color="var(--color-text-muted)" /><input aria-label="Search records" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" style={{ border: 0, outline: 0, width: '100%', background: 'transparent' }} />
          </div>
          <select aria-label="Filter records" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} style={{ padding: '0.65rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'white' }}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        </div>
        {filteredRows.length ? <div className={styles.recordList}>{filteredRows.map((row) => <div className={styles.recordRow} key={`${row.primary}-${row.detail}`}><div><strong>{row.primary}</strong><div className={styles.recordSecondary}>{row.secondary}</div></div><span className={styles.recordDetail}>{row.detail}</span><span className={styles.recordStatus}>{row.status}</span><Button variant="ghost" size="sm" onClick={() => setNotice(`Viewing details for ${row.primary}.`)}>View</Button></div>)}</div> : <p>{emptyLabel}</p>}
      </div>
    </DashboardLayout>
  );
}