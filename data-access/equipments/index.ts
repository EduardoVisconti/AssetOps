import { db } from '@/lib/firebase';
import type { Equipment } from '@/types/equipment';
import type { MaintenanceRecord } from '@/types/maintenance';
import type { EquipmentEvent } from '@/types/events';

import {
	collection,
	getDocs,
	getDoc,
	doc,
	addDoc,
	updateDoc,
	serverTimestamp,
	query,
	orderBy,
	limit,
	where,
	writeBatch,
	type WriteBatch
} from 'firebase/firestore';

const equipmentsCollection = collection(db, 'equipments');

/* ---------------------------------------
   Helpers
---------------------------------------- */

// lastServiceDate: "yyyy-MM-dd"
function computeNextServiceDate(
	lastServiceDate: string,
	intervalDays: number
): string {
	const base = new Date(`${lastServiceDate}T00:00:00`);
	base.setDate(base.getDate() + intervalDays);
	return base.toISOString().slice(0, 10);
}

function safeParseDate(value?: string): Date | null {
	if (!value) return null;
	const d = new Date(`${value}T00:00:00`);
	return Number.isNaN(d.getTime()) ? null : d;
}

function getDocTimestampMillis(value: any): number {
	if (!value) return 0;
	if (typeof value?.toMillis === 'function') return value.toMillis();
	if (typeof value?.toDate === 'function') return value.toDate().getTime();
	return 0;
}

function getEquipmentNextServiceMillis(eq: Equipment): number {
	const anyEq = eq as any;

	// 1) stored nextServiceDate
	const stored =
		typeof anyEq?.nextServiceDate === 'string'
			? anyEq.nextServiceDate
			: undefined;
	const derived = stored || eq.nextServiceDate;
	const next = safeParseDate(derived);
	if (next) return next.getTime();

	// 2) fallback: lastServiceDate + interval
	const last = safeParseDate(eq.lastServiceDate);
	if (!last) return 0;

	const interval =
		typeof anyEq?.serviceIntervalDays === 'number'
			? anyEq.serviceIntervalDays
			: 180;
	last.setDate(last.getDate() + interval);
	return last.getTime();
}

function statusPriority(status: Equipment['status']): number {
	if (status === 'maintenance') return 0;
	if (status === 'inactive') return 1;
	return 2;
}

/* ---------------------------------------
   Public API
---------------------------------------- */

export type EquipmentsSort =
	| 'updated_desc'
	| 'created_desc'
	| 'name_asc'
	| 'status_ops'
	| 'next_service_asc';

export interface GetEquipmentsListOptions {
	includeArchived?: boolean;
	sort?: EquipmentsSort;
	limit?: number;
}

export const getEquipmentsList = async (
	options: GetEquipmentsListOptions = {}
): Promise<Equipment[]> => {
	const {
		includeArchived = false,
		sort = 'updated_desc',
		limit: max
	} = options;

	const clauses: any[] = [];

	if (sort === 'updated_desc') clauses.push(orderBy('updatedAt', 'desc'));
	else if (sort === 'created_desc') clauses.push(orderBy('createdAt', 'desc'));
	else if (sort === 'name_asc') clauses.push(orderBy('name', 'asc'));
	else clauses.push(orderBy('updatedAt', 'desc'));

	if (typeof max === 'number') clauses.push(limit(max));

	let list: Equipment[] = [];

	try {
		const q = query(equipmentsCollection, ...clauses);
		const snapshot = await getDocs(q);

		list = snapshot.docs.map((d) => ({
			id: d.id,
			...(d.data() as Omit<Equipment, 'id'>)
		}));
	} catch {
		const snapshot = await getDocs(equipmentsCollection);
		list = snapshot.docs.map((d) => ({
			id: d.id,
			...(d.data() as Omit<Equipment, 'id'>)
		}));
	}

	if (!includeArchived) {
		list = list.filter((e) => !Boolean((e as any)?.archivedAt));
	}

	if (sort === 'status_ops') {
		list.sort((a, b) => {
			const ap = statusPriority(a.status);
			const bp = statusPriority(b.status);
			if (ap !== bp) return ap - bp;

			const an = getEquipmentNextServiceMillis(a);
			const bn = getEquipmentNextServiceMillis(b);
			if (an !== bn) return an - bn;

			return (a.name || '').localeCompare(b.name || '');
		});
	} else if (sort === 'next_service_asc') {
		list.sort((a, b) => {
			const an = getEquipmentNextServiceMillis(a);
			const bn = getEquipmentNextServiceMillis(b);

			if (!an && bn) return 1;
			if (an && !bn) return -1;
			if (an !== bn) return an - bn;

			const au = getDocTimestampMillis((a as any).updatedAt);
			const bu = getDocTimestampMillis((b as any).updatedAt);
			return bu - au;
		});
	}

	if (typeof max === 'number') list = list.slice(0, max);

	return list;
};

export const getEquipmentById = async (
	id: string
): Promise<Equipment | undefined> => {
	const ref = doc(db, 'equipments', id);
	const snap = await getDoc(ref);

	if (!snap.exists()) return undefined;

	return {
		id: snap.id,
		...(snap.data() as Omit<Equipment, 'id'>)
	};
};

/* ---------------------------------------
   Events
---------------------------------------- */

function eventsCollection(equipmentId: string) {
	return collection(db, 'equipments', equipmentId, 'events');
}

export const getEquipmentEvents = async (
	equipmentId: string,
	max = 25
): Promise<EquipmentEvent[]> => {
	const q = query(
		eventsCollection(equipmentId),
		orderBy('createdAt', 'desc'),
		limit(max)
	);
	const snapshot = await getDocs(q);

	return snapshot.docs.map((d) => ({
		id: d.id,
		...(d.data() as Omit<EquipmentEvent, 'id'>)
	}));
};

function buildEventPayload(params: {
	equipmentId: string;
	type: EquipmentEvent['type'];
	message: string;
	actorId: string;
	actorEmail: string | null;
	metadata?: Record<string, any>;
}) {
	const payload: Omit<EquipmentEvent, 'id'> & Record<string, any> = {
		equipmentId: params.equipmentId,
		type: params.type,
		message: params.message,
		actorId: params.actorId,
		actorEmail: params.actorEmail ?? null,
		metadata: params.metadata ?? undefined,
		createdAt: serverTimestamp()
	};

	// remove only undefined (metadata)
	Object.keys(payload).forEach(
		(k) => payload[k] === undefined && delete payload[k]
	);
	return payload;
}

function addEquipmentEvent(
	equipmentId: string,
	data: Omit<EquipmentEvent, 'id' | 'createdAt' | 'equipmentId'>
) {
	const payload = buildEventPayload({ equipmentId, ...data });
	return addDoc(eventsCollection(equipmentId), payload);
}

function addEquipmentEventInBatch(
	batch: WriteBatch,
	equipmentId: string,
	data: Omit<EquipmentEvent, 'id' | 'createdAt' | 'equipmentId'>
) {
	const payload = buildEventPayload({ equipmentId, ...data });
	const ref = doc(eventsCollection(equipmentId)); // auto-id
	batch.set(ref, payload);
}

/* ---------------------------------------
   Create / Update / Archive
---------------------------------------- */

export const createEquipment = async (
	data: Omit<Equipment, 'id'>,
	actor: { uid: string; email?: string | null }
): Promise<void> => {
	const serial = data.serialNumber?.trim();

	if (serial) {
		const snapshot = await getDocs(
			query(equipmentsCollection, where('serialNumber', '==', serial))
		);

		const serialExistsInActiveAsset = snapshot.docs.some((d) => {
			const existing = d.data() as any;
			const isArchived = Boolean(existing?.archivedAt);
			return !isArchived;
		});

		if (serialExistsInActiveAsset) throw new Error('SERIAL_ALREADY_EXISTS');
	}

	const interval = data.serviceIntervalDays ?? 180;
	const next =
		data.nextServiceDate?.trim() ||
		(data.lastServiceDate
			? computeNextServiceDate(data.lastServiceDate, interval)
			: undefined);

	const equipmentRef = doc(equipmentsCollection); // pre-generate id

	const payload: Omit<Equipment, 'id'> & Record<string, any> = {
		...data,

		serviceIntervalDays: interval,
		nextServiceDate: next,

		createdBy: actor.uid,
		createdByEmail: actor.email ?? null,
		updatedBy: actor.uid,
		updatedByEmail: actor.email ?? null,

		archivedAt: null,
		archivedBy: null,
		archivedByEmail: null,

		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	};

	// remove only undefined optional fields
	Object.keys(payload).forEach(
		(k) => payload[k] === undefined && delete payload[k]
	);

	const batch = writeBatch(db);
	batch.set(equipmentRef, payload);

	addEquipmentEventInBatch(batch, equipmentRef.id, {
		type: 'equipment.created',
		actorId: actor.uid,
		actorEmail: actor.email ?? null,
		message: 'Asset created'
	});

	await batch.commit();
};

export const updateEquipment = async (
	id: string,
	data: Omit<Equipment, 'id'>,
	actor: { uid: string; email?: string | null }
): Promise<void> => {
	const ref = doc(db, 'equipments', id);

	const interval = data.serviceIntervalDays ?? 180;
	const next =
		data.nextServiceDate?.trim() ||
		(data.lastServiceDate
			? computeNextServiceDate(data.lastServiceDate, interval)
			: undefined);

	const patch: Record<string, any> = {
		...data,
		serviceIntervalDays: interval,
		nextServiceDate: next,

		updatedBy: actor.uid,
		updatedByEmail: actor.email ?? null,
		updatedAt: serverTimestamp()
	};

	Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

	const batch = writeBatch(db);
	batch.update(ref, patch);

	addEquipmentEventInBatch(batch, id, {
		type: 'equipment.updated',
		actorId: actor.uid,
		actorEmail: actor.email ?? null,
		message: 'Asset updated'
	});

	await batch.commit();
};

export const archiveEquipment = async (
	id: string,
	actor: { uid: string; email?: string | null }
): Promise<void> => {
	const ref = doc(db, 'equipments', id);

	const patch: Record<string, any> = {
		archivedAt: serverTimestamp(),
		archivedBy: actor.uid,
		archivedByEmail: actor.email ?? null,

		updatedBy: actor.uid,
		updatedByEmail: actor.email ?? null,
		updatedAt: serverTimestamp()
	};

	const batch = writeBatch(db);
	batch.update(ref, patch);

	addEquipmentEventInBatch(batch, id, {
		type: 'equipment.archived',
		actorId: actor.uid,
		actorEmail: actor.email ?? null,
		message: 'Asset archived'
	});

	await batch.commit();
};

export const unarchiveEquipment = async (
	id: string,
	actor: { uid: string; email?: string | null }
): Promise<void> => {
	const ref = doc(db, 'equipments', id);

	const patch: Record<string, any> = {
		archivedAt: null,
		archivedBy: null,
		archivedByEmail: null,

		updatedBy: actor.uid,
		updatedByEmail: actor.email ?? null,
		updatedAt: serverTimestamp()
	};

	const batch = writeBatch(db);
	batch.update(ref, patch);

	addEquipmentEventInBatch(batch, id, {
		type: 'equipment.unarchived',
		actorId: actor.uid,
		actorEmail: actor.email ?? null,
		message: 'Asset restored'
	});

	await batch.commit();
};

/* ---------------------------------------
   Maintenance
---------------------------------------- */

function maintenanceCollection(equipmentId: string) {
	return collection(db, 'equipments', equipmentId, 'maintenance');
}

export const getMaintenanceHistory = async (
	equipmentId: string
): Promise<MaintenanceRecord[]> => {
	const q = query(maintenanceCollection(equipmentId), orderBy('date', 'desc'));
	const snapshot = await getDocs(q);

	return snapshot.docs.map((d) => ({
		id: d.id,
		...(d.data() as Omit<MaintenanceRecord, 'id'>)
	}));
};

export const addMaintenanceRecord = async (
	equipmentId: string,
	data: Omit<
		MaintenanceRecord,
		'id' | 'createdAt' | 'createdBy' | 'createdByEmail'
	>,
	actor: { uid: string; email?: string | null }
): Promise<void> => {
	// Read interval first (read outside batch is OK)
	const equipmentRef = doc(db, 'equipments', equipmentId);
	const snap = await getDoc(equipmentRef);

	let interval = 180;
	if (snap.exists()) {
		const existing = snap.data() as any;
		if (typeof existing?.serviceIntervalDays === 'number')
			interval = existing.serviceIntervalDays;
	}

	const nextServiceDate = computeNextServiceDate(data.date, interval);

	const maintenanceRef = doc(maintenanceCollection(equipmentId)); // auto-id

	const maintenancePayload: Omit<MaintenanceRecord, 'id'> &
		Record<string, any> = {
		date: data.date,
		type: data.type,
		notes: data.notes?.trim() || undefined,

		createdBy: actor.uid,
		createdByEmail: actor.email ?? null,
		createdAt: serverTimestamp()
	};

	Object.keys(maintenancePayload).forEach(
		(k) => maintenancePayload[k] === undefined && delete maintenancePayload[k]
	);

	const equipmentPatch: Record<string, any> = {
		lastServiceDate: data.date,
		nextServiceDate,

		updatedBy: actor.uid,
		updatedByEmail: actor.email ?? null,
		updatedAt: serverTimestamp()
	};

	const batch = writeBatch(db);

	batch.set(maintenanceRef, maintenancePayload);
	batch.update(equipmentRef, equipmentPatch);

	addEquipmentEventInBatch(batch, equipmentId, {
		type: 'maintenance.added',
		actorId: actor.uid,
		actorEmail: actor.email ?? null,
		message: 'Maintenance record added',
		metadata: {
			date: data.date,
			maintenanceType: data.type,
			nextServiceDate,
			serviceIntervalDays: interval
		}
	});

	await batch.commit();
};
