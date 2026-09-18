'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, User, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';
import styles from './login.module.css';

export default function RoleSelectionLanding() {
  return (
    <main className={styles.loginPage}>
      <div className={styles.loginContainer} style={{ maxWidth: '560px' }}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <div className={styles.iconWrapper}>
              <HeartPulse size={28} color="var(--color-primary)" />
            </div>
          </Link>
          <h1 className={styles.title}>Welcome to MedIntel</h1>
          <p className={styles.subtitle}>Select your portal entry point to sign in securely</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/login/patient" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#eff6ff',
                  color: '#2563eb'
                }}>
                  <User size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main, #1e293b)', margin: 0 }}>
                    Patient Portal
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                    Book appointments, view history, and access health records
                  </p>
                </div>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>
          </Link>

          <Link href="/login/doctor" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#ecfdf5',
                  color: '#059669'
                }}>
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main, #1e293b)', margin: 0 }}>
                    Doctor Workbench
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                    Manage schedule, consultation queue, and clinical summaries
                  </p>
                </div>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>
          </Link>

          <Link href="/login/admin" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#fef2f2',
                  color: '#dc2626'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main, #1e293b)', margin: 0 }}>
                    System Administration
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                    Manage users, doctors, system permissions, and analytics
                  </p>
                </div>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>
          </Link>
        </div>

        <div className={styles.modeSwitch} style={{ marginTop: '2rem' }}>
          <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
            Back to MedIntel Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
