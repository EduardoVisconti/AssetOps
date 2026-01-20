import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types/user-profile';

import { doc, getDoc } from 'firebase/firestore';

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
 * Enterprise note:
 * - Neste projeto, SOMENTE admin escreve em /users.
 * - Portanto, NÃO criamos perfil automaticamente no client.
 * - Usuário sem profile => cai como "viewer" no app e não consegue escrever nada.
 *
 * Provisionamento (criar /users/{uid}) deve ser feito por admin
 * via Firebase Console ou script/Cloud Function.
 */
