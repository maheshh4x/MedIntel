'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Heart, Search, ShieldAlert, Thermometer, UserCheck, Stethoscope } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import styles from './StaffIntakeDesk.module.css';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  appointmentTime: string;
  department: string;
  chiefComplaint: string;
}

const mockPatients: Patient[] = [
  { id: 'P-101', name: 'John Doe', age: 45, gender: 'Male', appointmentTime: '09:30 AM', department: 'Cardiology', chiefComplaint: 'Mild chest discomfort & tightness after exertion' },
  { id: 'P-102', name: 'Priya Shah', age: 34, gender: 'Female', appointmentTime: '10:00 AM', department: 'General Medicine', chiefComplaint: 'High fever (102°F) and persistent cough for 3 days' },
  { id: 'P-103', name: 'Robert Lee', age: 58, gender: 'Male', appointmentTime: '10:45 AM', department: 'Endocrinology', chiefComplaint: 'Routine blood sugar check & fatigue' },
  { id: 'P-104', name: 'Ananya Sharma', age: 29, gender: 'Female', appointmentTime: '11:15 AM', department: 'Neurology', chiefComplaint: 'Recurrent severe throbbing headache with photophobia' }
];

const staffNavItems = [
  { label: 'Intake Desk', href: '/staff/intake', icon: <Activity size={20} />, active: true },
  { label: 'Patient Queue', href: '/staff/dashboard', icon: <UserCheck size={20} /> }
];

export function StaffIntakeDesk() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Vitals State
  const [systolic, setSystolic] = useState<string>('130');
  const [diastolic, setDiastolic] = useState<string>('85');
  const [heartRate, setHeartRate] = useState<string>('78');
  const [temp, setTemp] = useState<string>('98.6');
  const [spo2, setSpo2] = useState<string>('98');
  const [bloodSugar, setBloodSugar] = useState<string>('110');
  const [heightCm, setHeightCm] = useState<string>('172');
  const [weightKg, setWeightKg] = useState<string>('74');
  const [observations, setObservations] = useState<string>('Patient arrived alert, oriented x 3. Mentions slight shortness of breath when climbing stairs.');
  
  const [submitted, setSubmitted] = useState(false);
  const [recentLogs, setRecentLogs] = useState<Array<{ patientName: string; time: string; vitals: string; triage: string }>>([
    { patientName: 'Carlos Ray', time: '09:10 AM', vitals: 'BP 120/80 • HR 72 • Temp 98.4°F', triage: 'Routine' }
  ]);

  // Calculate BMI
  const heightM = parseFloat(heightCm) / 100;
  const bmi = heightM > 0 && parseFloat(weightKg) > 0 ? (parseFloat(weightKg) / (heightM * heightM)).toFixed(1) : 'N/A';

  // Calculate Triage Priority based on vitals thresholds
  const sysVal = parseInt(systolic) || 120;
  const spo2Val = parseInt(spo2) || 98;
  const tempVal = parseFloat(temp) || 98.6;

  let triagePriority = 'Routine';
  if (sysVal >= 160 || sysVal <= 90 || spo2Val < 92 || tempVal >= 103) {
    triagePriority = 'Critical';
  } else if (sysVal >= 140 || tempVal >= 101 || spo2Val <= 94) {
    triagePriority = 'Urgent';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setRecentLogs([
      {
        patientName: selectedPatient.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        vitals: `BP ${systolic}/${diastolic} • HR ${heartRate} • Temp ${temp}°F • SpO2 ${spo2}%`,
        triage: triagePriority
      },
      ...recentLogs
    ]);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={staffNavItems} userRole="Healthcare Staff" userName="Nurse Sarah Miller">
      <div className={styles.staffContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Outpatient Triage & Clinical Intake Desk</p>
            <h1 className={styles.title}>Preliminary Vitals Recording</h1>
            <p className={styles.subtitle}>
              Record patient vital signs and preliminary observations before doctor consultation to streamline clinical workflow.
            </p>
          </div>
          <div className={styles.safetyDisclaimer}>
            <ShieldAlert size={18} color="var(--color-primary)" />
            <span>
              <strong>Clinical Guardrail:</strong> Vitals intake is for preliminary documentation only. Emergency cases must be directed to ER immediately.
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className={styles.grid}>
          {/* Patient Selection Queue */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <UserCheck size={20} color="var(--color-primary)" />
              Arrived Patient Queue
            </h2>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search patient name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}
              />
            </div>
            <div className={styles.patientList}>
              {filteredPatients.map((p) => (
                <div
                  key={p.id}
                  className={`${styles.patientItem} ${selectedPatient.id === p.id ? styles.patientItemActive : ''}`}
                  onClick={() => setSelectedPatient(p)}
                >
                  <div>
                    <div className={styles.patientName}>{p.name} ({p.gender}, {p.age}y)</div>
                    <div className={styles.patientMeta}>ID: {p.id} • Dept: {p.department}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>{p.appointmentTime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals Form & Triage Calculator */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Heart size={20} color="var(--color-primary)" />
              Record Vitals for {selectedPatient.name}
            </h2>

            {/* Triage Priority Display */}
            <div
              className={`${styles.triageBox} ${
                triagePriority === 'Critical'
                  ? styles.triageCritical
                  : triagePriority === 'Urgent'
                  ? styles.triageUrgent
                  : styles.triageRoutine
              }`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} />
                <span>Calculated Patient Priority Triage: <strong>{triagePriority.toUpperCase()}</strong></span>
              </div>
              <span className={styles.bmiBadge} style={{ background: 'rgba(255,255,255,0.8)' }}>
                BMI: {bmi}
              </span>
            </div>

            <form className={styles.formGrid} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Systolic BP (mmHg)</label>
                <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>Diastolic BP (mmHg)</label>
                <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>Heart Rate (BPM)</label>
                <input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>Body Temperature (°F)</label>
                <input type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>Oxygen Saturation SpO2 (%)</label>
                <input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>Blood Glucose (mg/dL)</label>
                <input type="number" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label>Height (cm)</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label>Weight (kg)</label>
                <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Preliminary Nurse Observations & Patient Symptoms</label>
                <textarea
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Record initial physical appearance, pain level, or notes for doctor..."
                />
              </div>

              <div className={`${styles.actions} ${styles.fullWidth}`}>
                <Button type="submit">
                  <Stethoscope size={16} /> Submit Vitals to Doctor Desk
                </Button>
              </div>

              {submitted && (
                <div className={`${styles.fullWidth}`} style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <CheckCircle size={18} /> Vitals and observations successfully pushed to doctor record!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Recent Recorded Logs */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Intake Logs Today</h2>
          <table className={styles.recentLogTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Recorded Vitals</th>
                <th>Triage Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{log.time}</td>
                  <td><strong>{log.patientName}</strong></td>
                  <td>{log.vitals}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor:
                          log.triage === 'Critical' ? 'var(--color-danger-bg)' : log.triage === 'Urgent' ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                        color:
                          log.triage === 'Critical' ? 'var(--color-danger)' : log.triage === 'Urgent' ? '#b45309' : 'var(--color-success)'
                      }}
                    >
                      {log.triage}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-success)', fontWeight: 500 }}>Ready for Doctor</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
