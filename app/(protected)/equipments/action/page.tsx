import EquipmentForm from '../_components/form/equipment-form';
import PageHeader from '@/components/core/headers/page-header';
import { getEquipmentById } from '@/data-access/equipments';
import { Card, CardContent } from '@/components/ui/card';

interface PageProps {
	searchParams: {
		action?: 'add' | 'edit';
		id?: string;
	};
}

export default async function EquipmentActionPage({ searchParams }: PageProps) {
	const action = searchParams.action ?? 'add';

	const equipment =
		action === 'edit' && searchParams.id
			? await getEquipmentById(searchParams.id)
			: undefined;

	if (action === 'edit' && !equipment) {
		return (
			<section className='p-4 md:p-6'>
				<PageHeader
					pageTitle='Asset not found'
					pageDescription='The requested asset does not exist or was removed.'
				/>
			</section>
		);
	}

	return (
		<section>
			<PageHeader
				pageTitle={action === 'add' ? 'Add Asset' : 'Edit Asset'}
				pageDescription={
					action === 'add'
						? 'Create a new asset and start tracking it'
						: 'Update asset information and maintenance details'
				}
			/>

			<Card className='mx-auto w-full max-w-2xl mt-6'>
				<CardContent className='pt-6'>
					<EquipmentForm
						action={action}
						equipment={equipment}
					/>
				</CardContent>
			</Card>
		</section>
	);
}
