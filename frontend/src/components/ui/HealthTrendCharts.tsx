'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, Heart, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import styles from './HealthTrendCharts.module.css';

const patientNavItems = [
  { label: 'Dashboard', href: '/patient/dashboard', icon: <Activity size={20} /> },
  { label: 'Medical Reports', href: '/patient/reports', icon: <Activity size={20} /> },
  { label: 'Health Trends', href: '/patient/trends', icon: <TrendingUp size={20} />, active: true },
  { label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker', icon: <Activity size={20} /> }
];

export function HealthTrendCharts() {
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y'>('6M');

  return (
    <DashboardLayout navItems={patientNavItems} userRole="Patient" userName="Mahesh">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>AI Health Indicator Trend Analyzer</h1>
            <p className={styles.subtitle}>
              Compare health indicators over time to detect early trends in Blood Pressure, Blood Sugar, BMI, and Cholesterol.
            </p>
          </div>

          <div className={styles.timeframeSelector}>
            {(['3M', '6M', '1Y'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'primary' : 'outline'}
                onClick={() => setTimeframe(tf)}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                {tf === '3M' ? '3 Months' : tf === '6M' ? '6 Months' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Insight Summary Banner */}
        <div className={styles.summaryBanner}>
          <div style={{ background: 'var(--color-primary-light)', padding: '0.75rem', borderRadius: '50%' }}>
            <Sparkles size={24} color="var(--color-primary)" />
          </div>
          <div>
            <strong style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>AI Longitudinal Health Summary</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Over the last 6 months, your Blood Pressure has shown a mild upward trend (+6 mmHg Systolic), while your Fasting Glucose levels stabilized at ~110 mg/dL after dietary adjustments.
            </p>
          </div>
        </div>

        {/* Grid of 4 Interactive Charts */}
        <div className={styles.chartGrid}>
          {/* Chart 1: Blood Pressure */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={18} color="var(--color-primary)" /> Blood Pressure (Systolic / Diastolic)
              </span>
              <span className={`${styles.metricBadge} ${styles.badgeWarning}`}>
                <ArrowUpRight size={14} style={{ verticalAlign: 'middle' }} /> Elevated Trend
              </span>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              134 / 86 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>mmHg (Latest)</span>
            </div>

            {/* SVG Line Chart */}
            <svg className={styles.svgChart} viewBox="0 0 400 150">
              <line x1="40" y1="20" x2="380" y2="20" stroke="#f0e6e0" strokeDasharray="4" />
              <line x1="40" y1="70" x2="380" y2="70" stroke="#f0e6e0" strokeDasharray="4" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="#f0e6e0" />

              {/* Systolic Line */}
              <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                points="50,110 120,95 190,85 260,65 330,50 370,45"
              />
              {/* Diastolic Line */}
              <polyline
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="2.5"
                points="50,130 120,125 190,120 260,110 330,105 370,100"
              />

              {/* Data points */}
              <circle cx="370" cy="45" r="5" fill="var(--color-primary)" />
              <circle cx="370" cy="100" r="4" fill="var(--color-secondary)" />

              {/* Month Labels */}
              <text x="50" y="140" fontSize="10" fill="#9a8c86">Mar</text>
              <text x="120" y="140" fontSize="10" fill="#9a8c86">Apr</text>
              <text x="190" y="140" fontSize="10" fill="#9a8c86">May</text>
              <text x="260" y="140" fontSize="10" fill="#9a8c86">Jun</text>
              <text x="330" y="140" fontSize="10" fill="#9a8c86">Jul</text>
              <text x="370" y="140" fontSize="10" fill="#9a8c86">Aug</text>
            </svg>
          </div>

          {/* Chart 2: Fasting Blood Sugar */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={18} color="var(--color-secondary)" /> Fasting Blood Glucose
              </span>
              <span className={`${styles.metricBadge} ${styles.badgeSuccess}`}>
                <CheckCircle2 size={14} style={{ verticalAlign: 'middle' }} /> Stabilized
              </span>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              110 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>mg/dL (Latest)</span>
            </div>

            <svg className={styles.svgChart} viewBox="0 0 400 150">
              <line x1="40" y1="30" x2="380" y2="30" stroke="#f0e6e0" strokeDasharray="4" />
              <line x1="40" y1="80" x2="380" y2="80" stroke="#f0e6e0" strokeDasharray="4" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="#f0e6e0" />

              <polyline
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="3"
                points="50,40 120,55 190,75 260,85 330,80 370,82"
              />
              <circle cx="370" cy="82" r="5" fill="var(--color-secondary)" />

              <text x="50" y="140" fontSize="10" fill="#9a8c86">Mar</text>
              <text x="120" y="140" fontSize="10" fill="#9a8c86">Apr</text>
              <text x="190" y="140" fontSize="10" fill="#9a8c86">May</text>
              <text x="260" y="140" fontSize="10" fill="#9a8c86">Jun</text>
              <text x="330" y="140" fontSize="10" fill="#9a8c86">Jul</text>
              <text x="370" y="140" fontSize="10" fill="#9a8c86">Aug</text>
            </svg>
          </div>

          {/* Chart 3: Body Mass Index (BMI) */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>BMI (Body Mass Index)</span>
              <span className={`${styles.metricBadge} ${styles.badgeSuccess}`}>Normal Range</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>24.8 kg/m²</div>
            <svg className={styles.svgChart} viewBox="0 0 400 150">
              <line x1="40" y1="60" x2="380" y2="60" stroke="#f0e6e0" strokeDasharray="4" />
              <polyline fill="none" stroke="#6b5c56" strokeWidth="2.5" points="50,70 120,68 190,65 260,63 330,60 370,60" />
              <circle cx="370" cy="60" r="4" fill="#6b5c56" />
              <text x="50" y="140" fontSize="10" fill="#9a8c86">Mar</text>
              <text x="120" y="140" fontSize="10" fill="#9a8c86">Apr</text>
              <text x="190" y="140" fontSize="10" fill="#9a8c86">May</text>
              <text x="260" y="140" fontSize="10" fill="#9a8c86">Jun</text>
              <text x="330" y="140" fontSize="10" fill="#9a8c86">Jul</text>
              <text x="370" y="140" fontSize="10" fill="#9a8c86">Aug</text>
            </svg>
          </div>

          {/* Chart 4: Total Cholesterol */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Total Cholesterol</span>
              <span className={`${styles.metricBadge} ${styles.badgeWarning}`}>Slightly Borderline</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>205 mg/dL</div>
            <svg className={styles.svgChart} viewBox="0 0 400 150">
              <line x1="40" y1="40" x2="380" y2="40" stroke="#f0e6e0" strokeDasharray="4" />
              <polyline fill="none" stroke="var(--color-primary)" strokeWidth="2.5" points="50,90 120,80 190,65 260,50 330,45 370,42" />
              <circle cx="370" cy="42" r="4" fill="var(--color-primary)" />
              <text x="50" y="140" fontSize="10" fill="#9a8c86">Mar</text>
              <text x="120" y="140" fontSize="10" fill="#9a8c86">Apr</text>
              <text x="190" y="140" fontSize="10" fill="#9a8c86">May</text>
              <text x="260" y="140" fontSize="10" fill="#9a8c86">Jun</text>
              <text x="330" y="140" fontSize="10" fill="#9a8c86">Jul</text>
              <text x="370" y="140" fontSize="10" fill="#9a8c86">Aug</text>
            </svg>
          </div>
        </div>

        <div style={{ background: 'var(--color-primary-light)', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
          <ShieldAlert size={18} color="var(--color-primary)" />
          <span>
            <strong>Medical Disclaimer:</strong> Trend tracking helps you monitor personal progress over time. Always consult your healthcare professional to interpret long-term clinical trends.
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
