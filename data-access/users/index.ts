import { db } from '@/lib/firebase';
import type { UserProfile, UserRole } from '@/types/user-profile';

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const getUserProfile = async (
	uid: string
): Promise<UserProfile | null> => {
	const ref = doc(db, 'users', uid);
	const snap = await getDoc(ref);

	if (!snap.exists()) return null;

	const data = snap.data() as Omit<UserProfile, 'uid'>;
	return { uid, ...data };
};

/**
 * v1: ensures the current user has a profile document.
 * - If missing, creates it with role='viewer'.
 * - If exists, does NOT overwrite role.
 */
export const ensureUserProfile = async (
	uid: string,
	email: string
): Promise<void> => {
	const ref = doc(db, 'users', uid);
	const snap = await getDoc(ref);

	if (snap.exists()) return;

	const payload: Omit<UserProfile, 'uid'> = {
		email,
		role: 'viewer',
		createdAt: serverTimestamp()
	};

	await setDoc(ref, payload, { merge: true });
};

/**
 * Optional helper for manual role promotion (use only as admin in console or scripts).
 * Not used by the app by default.
 */
export const setUserRole = async (
	uid: string,
	email: string,
	role: UserRole
): Promise<void> => {
	const ref = doc(db, 'users', uid);

	const payload: Omit<UserProfile, 'uid'> = {
		email,
		role,
		createdAt: serverTimestamp()
	};

	await setDoc(ref, payload, { merge: true });
};
