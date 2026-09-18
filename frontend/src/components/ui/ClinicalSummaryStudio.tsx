'use client';

import { useState } from 'react';
import { Activity, AlertCircle, Bot, CheckCircle2, FileText, RefreshCw, Save, ShieldAlert, Sparkles, User, Clock, Calendar } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import styles from './ClinicalSummaryStudio.module.css';

interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  vitals: {
    bp: string;
    hr: number;
    temp: string;
    spo2: number;
    glucose: number;
    bmi: string;
    triage: 'Critical' | 'Urgent' | 'Routine';
  };
  history: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

const mockCases: PatientCase[] = [
  {
    id: 'P-101',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    chiefComplaint: 'Chest discomfort after physical exertion',
    vitals: { bp: '138/88', hr: 82, temp: '98.6°F', spo2: 97, glucose: 118, bmi: '25.3', triage: 'Urgent' },
    history: 'Hypertension (managed), non-smoker. No known drug allergies (NKDA).',
    soap: {
      subjective: 'Patient reports intermittent mild retrosternal chest tightness lasting 10-15 mins following exertion. Denies radiation to jaw/left arm, nausea, or diaphoresis.',
      objective: 'Alert, oriented. BP 138/88 mmHg, HR 82 bpm, SpO2 97% on room air. Heart sounds S1/S2 present, no murmurs. Lungs clear to auscultation bilaterally.',
      assessment: '1. Atypical chest pain — rule out exertional angina / CAD.\n2. Stage 1 Hypertension (uncontrolled).',
      plan: '1. Order 12-lead ECG and baseline Troponin T levels.\n2. Schedule exercise stress test.\n3. Recommend lifestyle modifications (low sodium diet, hydration).'
    }
  },
  {
    id: 'P-102',
    name: 'Priya Shah',
    age: 34,
    gender: 'Female',
    chiefComplaint: 'High fever (102°F) and productive cough',
    vitals: { bp: '118/76', hr: 96, temp: '102.1°F', spo2: 95, glucose: 95, bmi: '22.1', triage: 'Urgent' },
    history: 'Asthma in childhood. No chronic adult illnesses.',
    soap: {
      subjective: 'Patient presents with 3-day history of high grade fever, chills, yellow sputum cough, and pleuritic right-sided chest discomfort.',
      objective: 'Febrile (102.1°F), tachypneic. HR 96 bpm, SpO2 95%. Auscultation reveals bronchial breath sounds and crackles in right lower lobe.',
      assessment: '1. Community-Acquired Pneumonia (RLL involvement).\n2. Acute Febrile Illness.',
      plan: '1. Order Chest X-ray (PA view) and CBC with differential.\n2. Advise supportive pulmonary hygiene, bed rest, and oral fluids.\n3. Evaluate empirical antibiotic protocol following lab confirmation.'
    }
  }
];

const doctorNavItems = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <User size={20} /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Calendar size={20} /> },
  { label: 'Availability', href: '/doctor/availability', icon: <Clock size={20} /> },
  { label: 'Clinical Summary Studio', href: '/doctor/clinical-summary', icon: <FileText size={20} />, active: true },
  { label: 'Similar Cases Retrieval', href: '/doctor/similar-cases', icon: <Sparkles size={20} /> }
];

export function ClinicalSummaryStudio() {
  const { profile } = useAuth();
  const [selectedCase, setSelectedCase] = useState<PatientCase>(mockCases[0]);
  const [soapData, setSoapData] = useState(mockCases[0].soap);
  const [isGenerating, setIsGenerating] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleSelectCase = (c: PatientCase) => {
    setSelectedCase(c);
    setSoapData(c.soap);
    setApproved(false);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => setApproved(false), 4000);
  };

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DashboardLayout navItems={doctorNavItems} userRole="Doctor" userName={profile?.name || 'Doctor'}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>AI Clinical Summary & SOAP Studio</h1>
              <p className={styles.subtitle}>
                Review, edit, and approve AI-drafted clinical summaries synthesized from nurse vitals and patient records.
              </p>
            </div>

            <div className={styles.disclaimerBanner}>
              <ShieldAlert size={18} color="var(--color-secondary)" />
              <span>
                <strong>Clinical Guardrail:</strong> AI SOAP drafts are preliminary decision supports. Doctors must review and sign off before final entry into patient records.
              </span>
            </div>
          </div>

          {/* Workspace Grid */}
          <div className={styles.studioGrid}>
            {/* Left Panel: Patient Background & Vitals */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>
                <User size={20} color="var(--color-primary)" />
                Patient Selection & Nurse Vitals
              </h2>

              <div className={styles.patientSelector}>
                {mockCases.map((c) => (
                  <Button
                    key={c.id}
                    variant={selectedCase.id === c.id ? 'primary' : 'outline'}
                    onClick={() => handleSelectCase(c)}
                  >
                    {c.name} ({c.vitals.triage})
                  </Button>
                ))}
              </div>

              <div className={styles.patientCard}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selectedCase.name} ({selectedCase.gender}, {selectedCase.age} yrs)</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0' }}>
                  Chief Complaint: <strong>{selectedCase.chiefComplaint}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Medical History: {selectedCase.history}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                  Recorded Nurse Vitals (Intake Today):
                </div>

                <div className={styles.vitalBadgeGrid}>
                  <div className={styles.vitalBadge}>
                    <div className={styles.vitalLabel}>Blood Pressure</div>
                    <div className={styles.vitalVal}>{selectedCase.vitals.bp}</div>
                  </div>
                  <div className={styles.vitalBadge}>
                    <div className={styles.vitalLabel}>Heart Rate</div>
                    <div className={styles.vitalVal}>{selectedCase.vitals.hr} bpm</div>
                  </div>
                  <div className={styles.vitalBadge}>
                    <div className={styles.vitalLabel}>Body Temp</div>
                    <div className={styles.vitalVal}>{selectedCase.vitals.temp}</div>
                  </div>
                  <div className={styles.vitalBadge}>
                    <div className={styles.vitalLabel}>SpO2</div>
                    <div className={styles.vitalVal}>{selectedCase.vitals.spo2}%</div>
                  </div>
                  <div className={styles.vitalBadge}>
                    <div className={styles.vitalLabel}>Blood Glucose</div>
                    <div className={styles.vitalVal}>{selectedCase.vitals.glucose} mg/dL</div>
                  </div>
                  <div className={styles.vitalBadge}>
                    <div className={styles.vitalLabel}>BMI</div>
                    <div className={styles.vitalVal}>{selectedCase.vitals.bmi}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--color-background)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border-light)', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  <Bot size={16} /> AI NLP Insights
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Symptoms correlate with exertional cardiac strain. Nurse vitals indicate Stage 1 blood pressure elevation.
                </p>
              </div>
            </div>

            {/* Right Panel: AI SOAP Note Editor */}
            <div className={styles.panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
                <h2 className={styles.panelTitle} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <Sparkles size={20} color="var(--color-secondary)" />
                  AI SOAP Summary Note
                </h2>
                <Button variant="ghost" onClick={handleRegenerate} disabled={isGenerating}>
                  <RefreshCw size={15} className={isGenerating ? 'animate-spin' : ''} /> {isGenerating ? 'Drafting...' : 'Regenerate Draft'}
                </Button>
              </div>

              <div className={styles.soapBox}>
                <div className={styles.soapSection}>
                  <div className={styles.soapHeader}>
                    <span>S — Subjective (Patient Symptoms & Narrative)</span>
                  </div>
                  <textarea
                    className={styles.soapTextarea}
                    rows={3}
                    value={soapData.subjective}
                    onChange={(e) => setSoapData({ ...soapData, subjective: e.target.value })}
                  />
                </div>

                <div className={styles.soapSection}>
                  <div className={styles.soapHeader}>
                    <span>O — Objective (Nurse Vitals & Physical Exam)</span>
                  </div>
                  <textarea
                    className={styles.soapTextarea}
                    rows={3}
                    value={soapData.objective}
                    onChange={(e) => setSoapData({ ...soapData, objective: e.target.value })}
                  />
                </div>

                <div className={styles.soapSection}>
                  <div className={styles.soapHeader}>
                    <span>A — Assessment (Clinical Impression)</span>
                  </div>
                  <textarea
                    className={styles.soapTextarea}
                    rows={3}
                    value={soapData.assessment}
                    onChange={(e) => setSoapData({ ...soapData, assessment: e.target.value })}
                  />
                </div>

                <div className={styles.soapSection}>
                  <div className={styles.soapHeader}>
                    <span>P — Plan (Diagnostic Evaluation & Non-Pharmacological Management)</span>
                  </div>
                  <textarea
                    className={styles.soapTextarea}
                    rows={3}
                    value={soapData.plan}
                    onChange={(e) => setSoapData({ ...soapData, plan: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={15} /> Signed with Doctor Profile: {profile?.name || 'Verified Physician'}
                </div>
                <Button onClick={handleApprove}>
                  <Save size={16} /> Approve & Sign SOAP Record
                </Button>
              </div>

              {approved && (
                <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '0.65rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={18} /> Clinical SOAP summary successfully signed and appended to {selectedCase.name}&apos;s medical record!
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
