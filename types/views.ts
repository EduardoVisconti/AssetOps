import type { EquipmentsSort } from '@/data-access/equipments';
import type { Equipment } from '@/types/equipment';

export type StatusFilterValue = 'all' | Equipment['status'];
export type MaintenanceWindowValue = 'all' | 'due_30' | 'overdue';

export type EquipmentsSavedViewKey =
	| 'operational'
	| 'maintenance_focus'
	| 'archived';

export interface EquipmentsSavedView {
	key: EquipmentsSavedViewKey;
	label: string;
	includeArchived: boolean;
	sort: EquipmentsSort;
	status: StatusFilterValue;
	search?: string;

	maintenanceWindow?: MaintenanceWindowValue;
}
