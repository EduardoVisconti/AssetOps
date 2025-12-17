'use client';

import { DataTable } from '@/components/core/tables/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Equipment } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getEquipmentsList } from '@/data-access/equipments';

export default function EquipmentsTableSection() {
	const router = useRouter();

	const { data = [] } = useQuery<Equipment[]>({
		queryKey: ['equipments'],
		queryFn: getEquipmentsList
	});

	const columns: ColumnDef<Equipment>[] = [
		{
			accessorKey: 'name',
			header: 'Name'
		},
		{
			accessorKey: 'serialNumber',
			header: 'Serial'
		},
		{
			accessorKey: 'status',
			header: 'Status'
		}
	];

	return (
		<div className='space-y-4'>
			<div className='flex justify-between'>
				<Input placeholder='Filter by name...' />
				<Button onClick={() => router.push('/equipments/action?action=add')}>
					Add equipment
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={data}
			/>
		</div>
	);
}
