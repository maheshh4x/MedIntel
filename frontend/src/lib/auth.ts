import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN" | "STAFF";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: unknown;
  updatedAt?: unknown;
  isActive: boolean;
}

export { auth };

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    console.log("AUTH UID:", uid);

    const userDocRef = doc(db, "users", uid);

    console.log("FIRESTORE PATH:", `users/${uid}`);

    const userSnap = await getDoc(userDocRef);

    console.log("DOCUMENT EXISTS:", userSnap.exists());

    if (userSnap.exists()) {
      const data = userSnap.data();

      console.log("USER PROFILE:", data);
      console.log("USER ROLE:", data.role);

      return {
        ...data,
        role: String(data.role || '').toUpperCase() as UserRole,
      } as UserProfile;
    }

    console.log("USER PROFILE NOT FOUND");

    return null;
  } catch (error) {
    console.error("FIRESTORE PROFILE ERROR:", error);
    throw error;
  }
};

export const createUserProfile = async (
  uid: string,
  data: { name: string; email: string; role: UserRole }
): Promise<UserProfile> => {
  const userRef = doc(db, "users", uid);
  const profileData: UserProfile = {
    uid,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
  };

  await setDoc(userRef, profileData);

  // Initialize role-specific documents
  if (data.role === "PATIENT") {
    const patientRef = doc(db, "patients", uid);
    await setDoc(patientRef, {
      uid,
      fullName: data.name,
      email: data.email,
      dob: "",
      gender: "Unspecified",
      bloodGroup: "",
      allergies: [],
      chronicConditions: [],
      emergencyContact: "",
      insuranceId: "",
      createdAt: serverTimestamp(),
    }, { merge: true });
  } else if (data.role === "DOCTOR") {
    const doctorRef = doc(db, "doctors", uid);
    await setDoc(doctorRef, {
      uid,
      fullName: data.name,
      email: data.email,
      specialization: "General Physician",
      department: "General Medicine",
      licenseNumber: "",
      qualification: "",
      experience: "0 years",
      bio: "",
      profileImage: "",
      hospitalInfo: "MedIntel Central",
      consultationDuration: 20,
      contactInfo: "",
      isActive: true,
      createdAt: serverTimestamp(),
    }, { merge: true });
  }

  return profileData;
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole = "PATIENT"
) => {
  // Disallow arbitrary self-registration as ADMIN
  const safeRole: UserRole = role === "ADMIN" ? "PATIENT" : role;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await createUserProfile(user.uid, {
    name,
    email,
    role: safeRole,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const observeAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};