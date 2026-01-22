import type { Timestamp, FieldValue } from 'firebase/firestore';

export type UserRole = 'admin' | 'viewer';

export interface UserProfile {
	uid: string;
	email: string;
	role: UserRole;
	createdAt?: Timestamp | FieldValue;
	updatedAt?: Timestamp | FieldValue;
}
