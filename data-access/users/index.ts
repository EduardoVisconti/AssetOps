import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/user-profile';
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
 * Ensures the user profile exists.
 * - Create-on-first-login approach for portfolio apps.
 * - Role defaults to "viewer". Admin role can be elevated manually in console.
 */
export const ensureUserProfile = async (params: {
	uid: string;
	email: string;
}): Promise<UserProfile> => {
	const ref = doc(db, 'users', params.uid);
	const snap = await getDoc(ref);

	if (snap.exists()) {
		const data = snap.data() as Omit<UserProfile, 'uid'>;
		return { uid: params.uid, ...data };
	}

	const payload: Omit<UserProfile, 'uid'> & Record<string, any> = {
		uid: params.uid,
		email: params.email,
		role: 'viewer',
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	};

	// merge:false para garantir schema limpo
	await setDoc(ref, payload, { merge: false });

	return {
		uid: params.uid,
		email: params.email,
		role: 'viewer',
		createdAt: payload.createdAt,
		updatedAt: payload.updatedAt
	};
};
