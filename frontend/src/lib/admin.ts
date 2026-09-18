import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserRole } from './auth';

/**
 * Admin‑only helper to create a doctor account.
 * This bypasses the safe‑role guard in `registerUser` and forces the role to DOCTOR.
 * It should only be called from UI that is wrapped in `ProtectedRoute` with ADMIN role.
 */
export const adminCreateDoctor = async (
  email: string,
  password: string,
  name: string,
  extra: {
    specialization?: string;
    department?: string;
    licenseNumber?: string;
  }
): Promise<UserProfile> => {
  // 1️⃣ Create the Firebase Auth user
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  // 2️⃣ Build the profile with forced DOCTOR role
  const profile: UserProfile = {
    uid,
    name,
    email,
    role: 'DOCTOR' as UserRole,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
  };

  // 3️⃣ Write generic user document
  await setDoc(doc(db, 'users', uid), profile);

  // 4️⃣ Write doctor‑specific document
  await setDoc(
    doc(db, 'doctors', uid),
    {
      uid,
      fullName: name,
      email,
      specialization: extra.specialization ?? '',
      department: extra.department ?? '',
      licenseNumber: extra.licenseNumber ?? '',
      qualification: '',
      experience: '0 years',
      bio: '',
      profileImage: '',
      hospitalInfo: '',
      consultationDuration: 20,
      contactInfo: '',
      isActive: true,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  return profile;
};
