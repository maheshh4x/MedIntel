'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import {
  getDoctorAvailability,
  saveDoctorAvailabilitySlot,
  deleteDoctorAvailabilitySlot,
  AvailabilitySlot,
} from '../../../lib/firestore';
import styles from '../../patient/dashboard/dashboard.module.css';

const daysOfWeek: AvailabilitySlot['day'][] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const navItems = [
  { icon: <Clock size={20} />, label: 'Dashboard', href: '/doctor/dashboard' },
  { icon: <Clock size={20} />, label: 'Appointments', href: '/doctor/appointments' },
  { icon: <Clock size={20} />, label: 'Availability', href: '/doctor/availability', active: true },
  { icon: <Clock size={20} />, label: 'Patients', href: '/doctor/patients' },
  { icon: <Clock size={20} />, label: 'Clinical Summary', href: '/doctor/clinical-summary' },
  { icon: <Clock size={20} />, label: 'Profile', href: '/doctor/profile' },
];

export default function DoctorAvailabilityPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State for new schedule
  const [selectedDay, setSelectedDay] = useState<AvailabilitySlot['day']>('MONDAY');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [slotDuration, setSlotDuration] = useState(20);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAvailability = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getDoctorAvailability(user.uid);
      setSlots(data.filter((s) => s.isAvailable));
    } catch (err) {
      console.error('Error loading availability:', err);
      setNotice({ type: 'error', message: 'Failed to load availability schedules.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [user]);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (startTime >= endTime) {
      setNotice({ type: 'error', message: 'Start time must be earlier than end time.' });
      return;
    }

    setIsSaving(true);
    setNotice(null);

    try {
      await saveDoctorAvailabilitySlot({
        doctorId: user.uid,
        day: selectedDay,
        startTime,
        endTime,
        slotDuration: Number(slotDuration),
        isAvailable: true,
      });

      setNotice({ type: 'success', message: `Availability schedule added for ${selectedDay}.` });
      await fetchAvailability();
    } catch (err) {
      console.error('Error saving slot:', err);
      setNotice({ type: 'error', message: 'Unable to save availability schedule.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId?: string) => {
    if (!slotId) return;
    try {
      await deleteDoctorAvailabilitySlot(slotId);
      setNotice({ type: 'success', message: 'Schedule removed successfully.' });
      await fetchAvailability();
    } catch (err) {
      console.error('Error deleting slot:', err);
      setNotice({ type: 'error', message: 'Failed to remove schedule.' });
    }
  };

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <DashboardLayout navItems={navItems} userRole="Doctor">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Manage Doctor Availability</h1>
            <p className={styles.subtitle}>
              Configure your consultation hours. Patients can only book slots during times you explicitly set.
            </p>
          </div>
        </div>

        {notice && (
          <div
            className={styles.card}
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: notice.type === 'success' ? 'var(--color-success, #10b981)' : 'var(--color-danger, #ef4444)',
              background: notice.type === 'success' ? '#f0fdf4' : '#fef2f2',
              borderColor: notice.type === 'success' ? '#bbf7d0' : '#fecaca',
            }}
          >
            {notice.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{notice.message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Form Card */}
          <div className={styles.card}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-main)' }}>
              Add Consultation Schedule
            </h2>

            <form onSubmit={handleAddSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                  Day of the Week
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as AvailabilitySlot['day'])}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'white',
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                  Slot Duration (Minutes)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'white',
                  }}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes (Standard)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <Button type="submit" disabled={isSaving} style={{ marginTop: '0.5rem' }}>
                <Plus size={18} /> {isSaving ? 'Saving Schedule...' : 'Add Availability Slot'}
              </Button>
            </form>
          </div>

          {/* Configured Slots List Card */}
          <div className={styles.card}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-main)' }}>
              Active Configured Schedules
            </h2>

            {loading ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Loading availability settings...</p>
            ) : slots.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Clock size={36} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p style={{ margin: 0 }}>No availability schedules configured yet.</p>
                <small style={{ color: 'var(--color-danger, #ef4444)' }}>
                  Patients will see zero available appointment slots until you add a schedule above.
                </small>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-subtle, #f9fafb)',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--color-primary)', display: 'block' }}>{slot.day}</strong>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                        {slot.startTime} – {slot.endTime} ({slot.slotDuration} min slots)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSlot(slot.id)}
                      style={{ color: 'var(--color-danger, #ef4444)' }}
                    >
                      <Trash2 size={16} /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
