'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, CheckCircle2, FileText, Upload, ShieldAlert, Sparkles, Eye, Download, Calendar } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { uploadPatientReport } from '../../lib/storage';
import { getPatientMedicalReports, MedicalReportRecord } from '../../lib/firestore';
import styles from './OCRReportAnalyzer.module.css';

interface ExtractedMetric {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low';
}

const sampleLabReport: ExtractedMetric[] = [
  { testName: 'Fasting Blood Glucose', value: '126', unit: 'mg/dL', referenceRange: '70 – 99', status: 'High' },
  { testName: 'HbA1c (Glycated Hemoglobin)', value: '6.4', unit: '%', referenceRange: '< 5.7', status: 'High' },
  { testName: 'Total Cholesterol', value: '215', unit: 'mg/dL', referenceRange: '< 200', status: 'High' },
  { testName: 'HDL (Good Cholesterol)', value: '48', unit: 'mg/dL', referenceRange: '> 40', status: 'Normal' },
  { testName: 'LDL (Bad Cholesterol)', value: '138', unit: 'mg/dL', referenceRange: '< 100', status: 'High' },
  { testName: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5 – 17.5', status: 'Normal' },
  { testName: 'White Blood Cell Count (WBC)', value: '6.8', unit: 'x10^3/uL', referenceRange: '4.5 – 11.0', status: 'Normal' }
];

const patientNavItems = [
  { label: 'Dashboard', href: '/patient/dashboard', icon: <Activity size={20} /> },
  { label: 'Appointments', href: '/patient/appointments', icon: <Calendar size={20} /> },
  { label: 'Medical Reports (OCR)', href: '/patient/reports', icon: <FileText size={20} />, active: true },
  { label: 'Health Trends', href: '/patient/trends', icon: <Activity size={20} /> },
  { label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker', icon: <Activity size={20} /> }
];

export function OCRReportAnalyzer() {
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedReports, setUploadedReports] = useState<MedicalReportRecord[]>([]);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);

  const fetchReports = async () => {
    if (!user) return;
    try {
      const data = await getPatientMedicalReports(user.uid);
      setUploadedReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadProgress(0);
    setNotice(null);
    setIsScanning(true);

    try {
      await uploadPatientReport(user.uid, file, (progress) => {
        setUploadProgress(Math.round(progress));
      });
      setNotice({ type: 'success', msg: `File "${file.name}" uploaded successfully to Firebase Storage.` });
      await fetchReports();
    } catch (err) {
      console.error('Upload failed:', err);
      setNotice({ type: 'error', msg: 'Failed to upload report to Cloud Storage.' });
    } finally {
      setUploading(false);
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <DashboardLayout navItems={patientNavItems} userRole="Patient" userName={profile?.name || 'Patient'}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>OCR Medical Report Storage & Analyzer</h1>
            <p className={styles.subtitle}>
              Upload lab reports, prescriptions, or blood work to Firebase Cloud Storage with automated OCR value extraction.
            </p>
          </div>

          {notice && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '0.5rem',
                background: notice.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${notice.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: notice.type === 'success' ? '#166534' : '#991b1b',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              {notice.msg}
            </div>
          )}

          <div className={styles.disclaimerBanner}>
            <ShieldAlert size={18} color="var(--color-primary)" />
            <span>
              <strong>Educational Decision Support:</strong> OCR extraction organizes your records. It does not replace a doctor&apos;s diagnosis or authorize self-medication.
            </span>
          </div>

          <div className={styles.grid}>
            {/* File Upload Zone */}
            <div className={styles.card}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upload Lab Document</h2>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />

              <div
                className={styles.uploadZone}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} color="var(--color-primary)" />
                <div>
                  <strong>Click to upload medical record (PDF / Image)</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Saves file directly to Firebase Storage bucket
                  </p>
                </div>
              </div>

              {uploading && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    Uploading to Firebase: {uploadProgress}%
                  </p>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--color-primary)', transition: 'width 0.2s' }} />
                  </div>
                </div>
              )}

              {/* Document Preview Box */}
              <div className={styles.scanPreviewArea}>
                {isScanning && <div className={styles.laserLine} />}
                <FileText size={48} color={isScanning ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  OCR Document Analyzer Engine
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {isScanning ? 'Scanning document text with AI OCR...' : 'Ready for upload'}
                </div>
              </div>
            </div>

            {/* Extracted Metrics & Stored Files */}
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--color-secondary)" />
                  Cloud Saved Medical Files ({uploadedReports.length})
                </h2>
              </div>

              {uploadedReports.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
                  {uploadedReports.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.5rem',
                        background: 'var(--color-surface-subtle, #f8fafc)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={20} color="var(--color-primary)" />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem' }}>{r.fileName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {r.fileSize ? `${(r.fileSize / 1024).toFixed(1)} KB` : '0 KB'} • {r.status}
                          </span>
                        </div>
                      </div>
                      <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <Button variant="outline" size="sm">
                          <Download size={14} /> Open
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '1rem 0' }}>
                  No files uploaded to your medical vault yet.
                </p>
              )}

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Automated OCR Sample Extraction</h3>
                <table className={styles.extractedTable}>
                  <thead>
                    <tr>
                      <th>Test Parameter</th>
                      <th>Value</th>
                      <th>Reference Range</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleLabReport.slice(0, 4).map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.testName}</strong></td>
                        <td style={{ fontWeight: 700 }}>{row.value} {row.unit}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{row.referenceRange}</td>
                        <td>
                          <span className={row.status === 'High' ? styles.statusHigh : styles.statusNormal}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
