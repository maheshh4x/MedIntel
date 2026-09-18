'use client';

import { useState } from 'react';
import { Activity, CheckCircle2, FileText, Search, ShieldAlert, Sparkles, User, Database } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import styles from './SimilarCaseSearch.module.css';

interface SimilarCase {
  caseId: string;
  matchScore: number;
  demographics: string;
  presentation: string;
  vitalsSummary: string;
  confirmedDiagnosis: string;
  careStrategy: string;
  outcomeTimeline: string;
  successRate: string;
}

const mockCases: SimilarCase[] = [
  {
    caseId: 'ANON-CASE-8902',
    matchScore: 95,
    demographics: 'Male, 46 years (Non-smoker)',
    presentation: 'Substernal chest pressure triggered by climbing stairs, relieved by rest within 10 mins. BP 140/90.',
    vitalsSummary: 'BP 140/90 mmHg • HR 80 bpm • SpO2 98%',
    confirmedDiagnosis: 'Exertional Angina / Mild Coronary Artery Disease',
    careStrategy: 'Immediate 12-lead ECG, Troponin I assay, stress echocardiogram, low-sodium dietary plan, cardiac rehab guidance.',
    outcomeTimeline: 'Follow-up at 30 days: Complete symptom resolution post-lifestyle modification and stress test clearance.',
    successRate: '98% Positive Recovery'
  },
  {
    caseId: 'ANON-CASE-7411',
    matchScore: 89,
    demographics: 'Male, 48 years (Ex-smoker)',
    presentation: 'Episodic chest tightness following heavy meals & physical activity. No dyspnea.',
    vitalsSummary: 'BP 136/84 mmHg • HR 76 bpm • SpO2 97%',
    confirmedDiagnosis: 'Gastroesophageal Reflux Disease (GERD) mimicking Angina Pectoris',
    careStrategy: 'ECG ruled out acute ischemia. Recommended dietary timing adjustments, elevated head during sleep, stress reduction.',
    outcomeTimeline: 'Follow-up at 14 days: Symptoms ceased completely after dietary triggers eliminated.',
    successRate: '92% Symptom Reduction'
  },
  {
    caseId: 'ANON-CASE-5109',
    matchScore: 84,
    demographics: 'Female, 44 years',
    presentation: 'Atypical chest wall tenderness on palpation and anxiety-related hyperventilation.',
    vitalsSummary: 'BP 128/82 mmHg • HR 88 bpm • SpO2 99%',
    confirmedDiagnosis: 'Costochondritis & Stress-Induced Musculoskeletal Pain',
    careStrategy: 'Physical examination localized pain to sternocostal joints. Reassurance, warm compress therapy, physical physical therapy.',
    outcomeTimeline: 'Follow-up at 21 days: Pain resolved with gentle stretching and postural correction.',
    successRate: '96% Recovery'
  }
];

const doctorNavItems = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <User size={20} /> },
  { label: 'Clinical Summary Studio', href: '/doctor/clinical-summary', icon: <FileText size={20} /> },
  { label: 'Similar Cases Retrieval', href: '/doctor/similar-cases', icon: <Sparkles size={20} />, active: true }
];

export function SimilarCaseSearch() {
  const [query, setQuery] = useState('exertional chest pain hypertension 45yo male');
  const [cases, setCases] = useState<SimilarCase[]>(mockCases);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 700);
  };

  return (
    <DashboardLayout navItems={doctorNavItems} userRole="Doctor" userName="Dr. Marcus Vance, MD">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>AI Similar Clinical Case Retrieval Workspace</h1>
          <p className={styles.subtitle}>
            Retrieve anonymized historical patient cases with matching symptom vectors and care outcomes to assist clinical decision-making.
          </p>
        </div>

        <div className={styles.disclaimer}>
          <ShieldAlert size={18} color="var(--color-secondary)" />
          <span>
            <strong>Anonymized Decision Support:</strong> Cases are HIPAA-anonymized. Retained for historical outcome comparison. Physician judgment is required for all patient evaluations.
          </span>
        </div>

        {/* Search Bar */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type symptoms, ICD-10 code, or clinical query..."
          />
          <Button type="submit" disabled={isSearching}>
            <Search size={18} /> {isSearching ? 'Vector Searching...' : 'Find Similar Cases'}
          </Button>
        </form>

        {/* Case Cards */}
        <div className={styles.casesGrid}>
          {cases.map((c) => (
            <div key={c.caseId} className={styles.caseCard}>
              <div className={styles.caseHeader}>
                <span className={styles.caseId}>
                  <Database size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {c.caseId}
                </span>
                <span className={styles.matchBadge}>
                  <Sparkles size={13} /> {c.matchScore}% Vector Match
                </span>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Anonymized Demographics & Vitals</div>
                <div>{c.demographics}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{c.vitalsSummary}</div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Initial Presentation</div>
                <p style={{ color: 'var(--color-text-muted)' }}>{c.presentation}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Confirmed Diagnosis</div>
                <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{c.confirmedDiagnosis}</div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Non-Pharmacological Care Strategy</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{c.careStrategy}</p>
              </div>

              <div className={styles.section} style={{ paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)' }}>
                <div className={styles.outcomeBadge}>
                  <CheckCircle2 size={14} /> {c.successRate}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
                  {c.outcomeTimeline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
