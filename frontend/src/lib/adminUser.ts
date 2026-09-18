import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserRole } from './auth';

/**
 * Promote an existing Firebase Auth user to ADMIN role.
 * This writes/updates the corresponding document in the `users` collection.
 *
 * Usage (e.g., from a secure admin console or a server‑side script):
 *   await promoteToAdmin('USER_UID');
 */
export const promoteToAdmin = async (uid: string): Promise<UserProfile> => {
  const adminProfile: UserProfile = {
    uid,
    name: 'Admin User', // you may update the name later
    email: '', // email will be overwritten if already present
    role: 'ADMIN' as UserRole,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
  };

  // Merge with any existing fields (e.g., name, email) to avoid data loss
  await setDoc(doc(db, 'users', uid), adminProfile, { merge: true });
  return adminProfile;
};
