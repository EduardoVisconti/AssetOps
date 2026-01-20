import type { EquipmentsSort } from '@/data-access/equipments';
import type { Equipment } from '@/types/equipment';

export type StatusFilterValue = 'all' | Equipment['status'];

export type EquipmentsSavedViewKey =
	| 'operational'
	| 'maintenance_focus'
	| 'archived';

export interface EquipmentsSavedView {
	key: EquipmentsSavedViewKey;
	label: string;

	// estado que queremos “lembrar”
	includeArchived: boolean;
	sort: EquipmentsSort;
	status: StatusFilterValue;
	search: string; // opcional, mas útil para “templates”
}
