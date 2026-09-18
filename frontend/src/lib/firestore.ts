import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserRole, UserProfile } from "./auth";
export type { UserProfile };

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface PatientProfile {
  uid: string;
  id?: string;
  patientId?: string;
  fullName: string;
  email: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  allergies?: string;
  chronicConditions?: string[];
  emergencyContact: string;
  insuranceId: string;
  phone?: string;
  age?: number;
  medicalHistory?: string;
  createdAt?: unknown;
}

export interface DoctorProfile {
  uid: string;
  id?: string;
  doctorId?: string;
  verified?: boolean;
  fullName: string;
  email: string;
  specialization: string;
  department: string;
  licenseNumber: string;
  qualification: string;
  experience: string;
  bio: string;
  profileImage: string;
  hospitalInfo: string;
  consultationDuration: number;
  contactInfo: string;
  isActive: boolean;
  createdAt?: unknown;
}

export interface AvailabilitySlot {
  id?: string;
  doctorId: string;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "13:00"
  slotDuration: number; // in minutes, e.g. 20
  isAvailable: boolean;
}

export interface AppointmentRecord {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00 AM"
  endTime?: string;
  status: "SCHEDULED" | "WAITING" | "IN_CONSULTATION" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  symptoms: string;
  location?: string;
  type?: string;
  createdAt?: unknown;
}

export interface MedicalReportRecord {
  id?: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  status: "UPLOADED" | "PROCESSED";
  uploadedAt?: unknown;
}

// --- PATIENT HELPERS ---
export const getPatientProfile = async (uid: string): Promise<PatientProfile | null> => {
  const ref = doc(db, "patients", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as PatientProfile;
  return null;
};

export const updatePatientProfile = async (uid: string, data: Partial<PatientProfile>) => {
  const ref = doc(db, "patients", uid);
  await setDoc(ref, { uid, ...data, updatedAt: serverTimestamp() }, { merge: true });
  // Also update name in users collection if changed
  if (data.fullName) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { name: data.fullName, updatedAt: serverTimestamp() }).catch(() => {});
  }
};

// --- DOCTOR HELPERS ---
export const getDoctorProfile = async (uid: string): Promise<DoctorProfile | null> => {
  const ref = doc(db, "doctors", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as DoctorProfile;
  return null;
};

export const updateDoctorProfile = async (uid: string, data: Partial<DoctorProfile>) => {
  const ref = doc(db, "doctors", uid);
  await setDoc(ref, { uid, ...data, updatedAt: serverTimestamp() }, { merge: true });
  if (data.fullName) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { name: data.fullName, updatedAt: serverTimestamp() }).catch(() => {});
  }
};

export type PatientRecord = PatientProfile;

// --- PATIENT LIST HELPERS ---
export const getAllPatients = async (): Promise<PatientRecord[]> => {
  try {
    const q = query(collection(db, "patients"));
    const snap = await getDocs(q);
    const patients: PatientRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as PatientProfile;
      patients.push({
        ...data,
        uid: docSnap.id,
        id: docSnap.id,
        patientId: docSnap.id
      });
    });
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

// --- DOCTOR LIST HELPERS ---
export const getAllActiveDoctors = async (): Promise<DoctorProfile[]> => {
  try {
    const q = query(collection(db, "doctors"));
    const snap = await getDocs(q);
    const doctors: DoctorProfile[] = [];
    snap.forEach((docSnap) => {
      const docData = docSnap.data() as DoctorProfile;
      if (docData.isActive !== false) {
        doctors.push({
          ...docData,
          uid: docSnap.id,
          id: docSnap.id,
          doctorId: docSnap.id
        });
      }
    });
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

export const getAllDoctors = async (): Promise<DoctorProfile[]> => {
  try {
    const q = query(collection(db, "doctors"));
    const snap = await getDocs(q);
    const doctors: DoctorProfile[] = [];
    snap.forEach((docSnap) => {
      const docData = docSnap.data() as DoctorProfile;
      doctors.push({
        ...docData,
        uid: docSnap.id,
        id: docSnap.id,
        doctorId: docSnap.id
      });
    });
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

// --- DOCTOR AVAILABILITY ENGINE ---
export const getDoctorAvailability = async (doctorId: string): Promise<AvailabilitySlot[]> => {
  try {
    const q = query(collection(db, "availability"), where("doctorId", "==", doctorId));
    const snap = await getDocs(q);
    const slots: AvailabilitySlot[] = [];
    snap.forEach((docSnap) => {
      slots.push({ id: docSnap.id, ...(docSnap.data() as AvailabilitySlot) });
    });
    return slots;
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
};

export const saveDoctorAvailabilitySlot = async (slot: AvailabilitySlot) => {
  if (slot.id) {
    const ref = doc(db, "availability", slot.id);
    await updateDoc(ref, { ...slot, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, "availability"), {
      ...slot,
      createdAt: serverTimestamp(),
    });
  }
};

export const deleteDoctorAvailabilitySlot = async (slotId: string) => {
  const ref = doc(db, "availability", slotId);
  await updateDoc(ref, { isAvailable: false });
};

// Generate Available Time Slots Engine based on exact Doctor Availability and existing Booked Appointments
export const getAvailableSlotsForDate = async (
  doctorId: string,
  dateStr: string // "YYYY-MM-DD"
): Promise<TimeSlot[]> => {
  // 1. Get Day of Week (e.g. MONDAY)
  const dateObj = new Date(dateStr + "T00:00:00");
  const days: AvailabilitySlot["day"][] = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
  ];
  const dayName = days[dateObj.getDay()];

  // 2. Fetch doctor availability rules for this day
  const availabilityList = await getDoctorAvailability(doctorId);
  const daySchedules = availabilityList.filter(
    (s) => s.day === dayName && s.isAvailable
  );

  // IF Doctor has NOT explicitly configured availability for this day -> RETURN EMPTY SLOTS
  if (daySchedules.length === 0) {
    return [];
  }

  // 3. Generate raw time slots from schedules
  const rawSlots: TimeSlot[] = [];

  for (const schedule of daySchedules) {
    const duration = schedule.slotDuration || 20;
    const [startH, startM] = schedule.startTime.split(":").map(Number);
    const [endH, endM] = schedule.endTime.split(":").map(Number);

    let startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (startMinutes + duration <= endMinutes) {
      const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const period = h >= 12 ? "PM" : "AM";
        const displayH = h % 12 === 0 ? 12 : h % 12;
        const formattedH = displayH < 10 ? `0${displayH}` : `${displayH}`;
        const formattedM = m < 10 ? `0${m}` : `${m}`;
        return `${formattedH}:${formattedM} ${period}`;
      };

      const startTime = formatTime(startMinutes);
      const endTime = formatTime(startMinutes + duration);
      rawSlots.push({ startTime, endTime });

      startMinutes += duration;
    }
  }

  // 4. Fetch existing booked (non-cancelled) appointments for this doctor on this date
  const apptQuery = query(
    collection(db, "appointments"),
    where("doctorId", "==", doctorId),
    where("date", "==", dateStr)
  );
  const apptSnap = await getDocs(apptQuery);
  const bookedSlots = new Set<string>();

  apptSnap.forEach((docSnap) => {
    const data = docSnap.data() as AppointmentRecord;
    if (data.status !== "CANCELLED") {
      bookedSlots.add(data.startTime);
    }
  });

  // 5. Filter out already booked slots
  return rawSlots.filter((slot) => !bookedSlots.has(slot.startTime));
};

export const getAvailableSlotsForDoctorAndDate = getAvailableSlotsForDate;

// --- APPOINTMENTS HELPERS ---
export const bookAppointment = async (appt: Omit<AppointmentRecord, "id" | "createdAt">): Promise<string> => {
  // Check double-booking
  const q = query(
    collection(db, "appointments"),
    where("doctorId", "==", appt.doctorId),
    where("date", "==", appt.date),
    where("startTime", "==", appt.startTime)
  );
  const snap = await getDocs(q);
  const existing = snap.docs.filter((d) => (d.data() as AppointmentRecord).status !== "CANCELLED");
  if (existing.length > 0) {
    throw new Error("This slot has already been booked. Please choose another time.");
  }

  const docRef = await addDoc(collection(db, "appointments"), {
    ...appt,
    status: appt.status || "SCHEDULED",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const createAppointment = bookAppointment;

export const getPatientAppointments = async (patientId: string): Promise<AppointmentRecord[]> => {
  try {
    const q = query(collection(db, "appointments"), where("patientId", "==", patientId));
    const snap = await getDocs(q);
    const records: AppointmentRecord[] = [];
    snap.forEach((d) => records.push({ id: d.id, ...(d.data() as AppointmentRecord) }));
    return records;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return [];
  }
};

export const getDoctorAppointments = async (doctorId: string): Promise<AppointmentRecord[]> => {
  try {
    const q = query(collection(db, "appointments"), where("doctorId", "==", doctorId));
    const snap = await getDocs(q);
    const records: AppointmentRecord[] = [];
    snap.forEach((d) => records.push({ id: d.id, ...(d.data() as AppointmentRecord) }));
    return records;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return [];
  }
};

export const getAllAppointments = async (): Promise<AppointmentRecord[]> => {
  try {
    const snap = await getDocs(collection(db, "appointments"));
    const records: AppointmentRecord[] = [];
    snap.forEach((d) => records.push({ id: d.id, ...(d.data() as AppointmentRecord) }));
    return records;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return [];
  }
};

export const updateAppointmentStatus = async (apptId: string, status: AppointmentRecord["status"]) => {
  const ref = doc(db, "appointments", apptId);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
};

// --- MEDICAL REPORTS HELPERS ---
export const addMedicalReportRecord = async (report: Omit<MedicalReportRecord, "id" | "uploadedAt">) => {
  const docRef = await addDoc(collection(db, "medicalReports"), {
    ...report,
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getPatientMedicalReports = async (patientId: string): Promise<MedicalReportRecord[]> => {
  try {
    const q = query(collection(db, "medicalReports"), where("patientId", "==", patientId));
    const snap = await getDocs(q);
    const reports: MedicalReportRecord[] = [];
    snap.forEach((d) => reports.push({ id: d.id, ...(d.data() as MedicalReportRecord) }));
    return reports;
  } catch (error) {
    console.error("Error fetching medical reports:", error);
    return [];
  }
};

// --- ADMIN USER MANAGEMENT HELPERS ---
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, "users"));
    const users: UserProfile[] = [];
    snap.forEach((d) => users.push(d.data() as UserProfile));
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const toggleUserActiveStatus = async (uid: string, isActive: boolean) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { isActive, updatedAt: serverTimestamp() });

  // Update in doctor or patient document if applicable
  const doctorRef = doc(db, "doctors", uid);
  await updateDoc(doctorRef, { isActive, updatedAt: serverTimestamp() }).catch(() => {});
};

export const updateUserRole = async (uid: string, role: string) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { role, updatedAt: serverTimestamp() });
};
