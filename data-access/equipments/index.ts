import { Equipment } from '@/types/equipment';

export const getEquipmentsList = async (): Promise<Equipment[]> => {
	// Simula latência de API (opcional)
	await new Promise((r) => setTimeout(r, 300));

	return Array.from({ length: 75 }).map((_, i) => ({
		id: crypto.randomUUID(),
		name: `Equipment ${i + 1}`,
		serialNumber: `SN-${1000 + i}`,
		status: i % 3 === 0 ? 'maintenance' : i % 2 === 0 ? 'inactive' : 'active',
		purchaseDate: '2023-01-01',
		lastServiceDate: '2024-01-01'
	}));
};
