import type { Timestamp, FieldValue } from 'firebase/firestore';

export type MaintenanceType = 'preventive' | 'corrective';

export interface MaintenanceRecord {
	id: string;

	date: string; // yyyy-MM-dd
	type: MaintenanceType;
	notes?: string;

	createdBy: string;
	createdByEmail: string | null;
	createdAt?: Timestamp | FieldValue;
}
