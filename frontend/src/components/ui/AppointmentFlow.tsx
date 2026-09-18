'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin, Video, X, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import {
  getAllDoctors,
  getAvailableSlotsForDoctorAndDate,
  createAppointment,
  DoctorProfile,
  TimeSlot,
} from '../../lib/firestore';
import styles from './AppointmentFlow.module.css';

const navItems = [
  { label: 'Dashboard', href: '/patient/dashboard' },
  { label: 'Appointments', href: '/patient/appointments' },
  { label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker' },
  { label: 'Medical Reports', href: '/patient/reports' },
  { label: 'Health Trends', href: '/patient/trends' },
  { label: 'AI Assistant', href: '/patient/assistant' },
];

export function AppointmentFlow() {
  const { user, profile } = useAuth();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorIndex, setDoctorIndex] = useState(0);

  // Generate next 7 dates
  const [dateList, setDateList] = useState<{ dayStr: string; dateStr: string; displayDate: string }[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [symptoms, setSymptoms] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // 1. Initialize 7-day date picker options
  useEffect(() => {
    const list = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayStr = days[d.getDay()];
      const monthStr = months[d.getMonth()];
      const numStr = d.getDate().toString();
      const dateIso = d.toISOString().split('T')[0];
      list.push({
        dayStr,
        displayDate: `${dayStr}, ${monthStr} ${numStr}`,
        dateStr: dateIso,
      });
    }
    setDateList(list);
  }, []);

  // 2. Fetch doctors from Firestore
  useEffect(() => {
    async function loadDocs() {
      setLoadingDoctors(true);
      try {
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoadingDoctors(false);
      }
    }
    loadDocs();
  }, []);

  // 3. Fetch available slots whenever selected doctor or date changes
  const activeDoctor = doctors[doctorIndex];
  const activeDate = dateList[selectedDateIndex];

  useEffect(() => {
    async function fetchSlots() {
      if (!activeDoctor || !activeDate) return;
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const slots = await getAvailableSlotsForDoctorAndDate(activeDoctor.uid, activeDate.dateStr);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error getting slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [activeDoctor, activeDate]);

  // 4. Handle Final Appointment Creation
  const handleConfirmBooking = async () => {
    if (!user || !activeDoctor || !activeDate || !selectedSlot) return;
    setIsBooking(true);
    setBookingError('');

    try {
      await createAppointment({
        patientId: user.uid,
        patientName: profile?.name || user.email?.split('@')[0] || 'Patient',
        doctorId: activeDoctor.uid,
        doctorName: activeDoctor.fullName || 'Doctor',
        specialty: activeDoctor.specialization || 'General',
        date: activeDate.dateStr,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        symptoms: symptoms.trim() || 'Routine Consultation',
        status: 'SCHEDULED',
      });

      setIsReviewOpen(false);
      setIsBooked(true);
    } catch (err: unknown) {
      console.error('Booking failed:', err);
      const msg = err instanceof Error ? err.message : 'Unable to complete appointment booking.';
      setBookingError(msg);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <DashboardLayout
        navItems={navItems.map((item) => ({
          ...item,
          icon: <CalendarDays size={20} />,
          active: item.href === '/patient/appointments',
        }))}
        userRole="Patient"
        userName={profile?.name || 'Patient'}
      >
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Patient portal</p>
            <h1 className={styles.title}>Book an appointment</h1>
            <p className={styles.subtitle}>Choose a provider, a convenient date, and an available time slot.</p>
          </div>
        </div>

        {isBooked ? (
          <div className={styles.success}>
            <CheckCircle2 size={34} />
            <div>
              <h2>Appointment Confirmed & Saved</h2>
              <p>
                Your visit with {activeDoctor?.fullName} is booked for {activeDate?.displayDate} at{' '}
                {selectedSlot?.startTime}.
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsBooked(false)}>
              Book another
            </Button>
          </div>
        ) : (
          <div className={styles.flowGrid}>
            {/* Step 1: Doctor Provider Selection */}
            <section className={styles.panel}>
              <div className={styles.panelHeading}>
                <span className={styles.step}>1</span>
                <div>
                  <h2>Choose a provider</h2>
                  <p>Available specialists in MedIntel network</p>
                </div>
              </div>

              {loadingDoctors ? (
                <p style={{ color: 'var(--color-text-muted)', padding: '1rem' }}>Loading doctors from database...</p>
              ) : doctors.length === 0 ? (
                <div style={{ padding: '1.5rem', background: '#fffbe6', borderRadius: '0.5rem', color: '#856404' }}>
                  No active doctor profiles configured yet. Check back soon or contact administration.
                </div>
              ) : (
                <div className={styles.doctorOptions}>
                  {doctors.map((doc, idx) => (
                    <button
                      className={`${styles.doctorOption} ${idx === doctorIndex ? styles.selected : ''}`}
                      key={doc.doctorId}
                      onClick={() => setDoctorIndex(idx)}
                    >
                      <span className={styles.avatar}>
                        {(doc.fullName || 'Dr').replace('Dr. ', '').split(' ').map((p) => p[0]).join('')}
                      </span>
                      <span>
                        <strong>{doc.fullName}</strong>
                        <small>{doc.specialization || 'Specialist'}</small>
                        <small>
                          <MapPin size={13} /> {doc.department || 'Outpatient Clinic'}
                        </small>
                      </span>
                      <span className={styles.radio} />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Step 2: Date & Available Time Slot Engine */}
            <section className={styles.panel}>
              <div className={styles.panelHeading}>
                <span className={styles.step}>2</span>
                <div>
                  <h2>Pick a date & slot</h2>
                  <p>{activeDoctor?.fullName || 'Select Doctor'}</p>
                </div>
              </div>

              <div className={styles.dateOptions}>
                {dateList.map((item, idx) => (
                  <button
                    key={item.dateStr}
                    className={`${styles.dateOption} ${idx === selectedDateIndex ? styles.selected : ''}`}
                    onClick={() => setSelectedDateIndex(idx)}
                  >
                    <small>{item.dayStr}</small>
                    <strong>{item.dateStr.split('-')[2]}</strong>
                    <small>{item.dateStr.split('-')[1]}</small>
                  </button>
                ))}
              </div>

              <div className={styles.slotHeading}>
                <h3>Available Consultation Slots</h3>
                <span>
                  <Clock3 size={15} /> Firestore Engine
                </span>
              </div>

              {loadingSlots ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '0.5rem' }}>
                  Checking doctor availability rules & live bookings...
                </p>
              ) : availableSlots.length === 0 ? (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: '0.875rem',
                  }}
                >
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
                  No open slots found for this date. (Doctors must configure schedule under Doctor Workbench → Availability).
                </div>
              ) : (
                <div className={styles.slots}>
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.startTime}
                      className={`${styles.slot} ${slot.startTime === selectedSlot?.startTime ? styles.slotSelected : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Describe Your Symptoms / Reason for Visit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild headache, chest tightness, routine follow-up"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>
            </section>

            {/* Step 3: Review & Submit */}
            <section className={styles.reviewPanel}>
              <div className={styles.panelHeading}>
                <span className={styles.step}>3</span>
                <div>
                  <h2>Review your visit</h2>
                  <p>Check details before booking</p>
                </div>
              </div>

              <div className={styles.summary}>
                <strong>{activeDoctor?.fullName || 'Doctor'}</strong>
                <span>{activeDoctor?.specialization}</span>
                <span>
                  <CalendarDays size={15} /> {activeDate?.displayDate}
                </span>
                <span>
                  <Clock3 size={15} /> {selectedSlot ? selectedSlot.startTime : 'Select a slot'}
                </span>
                <span>
                  <MapPin size={15} /> {activeDoctor?.department || 'Main Campus'}
                </span>
              </div>

              <Button fullWidth disabled={!selectedSlot} onClick={() => setIsReviewOpen(true)}>
                Review & Confirm
              </Button>
            </section>
          </div>
        )}

        {/* Modal Dialog */}
        {isReviewOpen && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="booking-title">
              <button
                className={styles.modalClose}
                aria-label="Close booking review"
                onClick={() => setIsReviewOpen(false)}
              >
                <X size={20} />
              </button>
              <h2 id="booking-title">Confirm Appointment</h2>
              <p>Verify details before submitting into Firestore.</p>

              <div className={styles.modalDetails}>
                <strong>{activeDoctor?.fullName}</strong>
                <span>{activeDoctor?.specialization}</span>
                <span>
                  {activeDate?.displayDate} at {selectedSlot?.startTime}
                </span>
                <span>Symptoms: {symptoms || 'General Checkup'}</span>
              </div>

              {bookingError && (
                <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {bookingError}
                </p>
              )}

              <div className={styles.modalActions}>
                <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                  Go back
                </Button>
                <Button onClick={handleConfirmBooking} disabled={isBooking}>
                  {isBooking ? 'Saving Booking...' : 'Confirm & Reserve Slot'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}