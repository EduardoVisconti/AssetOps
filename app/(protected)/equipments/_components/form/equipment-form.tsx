'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';

import type { Equipment } from '@/types/equipment';
import { createEquipment, updateEquipment } from '@/data-access/equipments';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';

type EquipmentFormAction = 'add' | 'edit';

interface EquipmentFormProps {
	action: EquipmentFormAction;
	equipment?: Equipment;
}

/* ---------------- SCHEMA ---------------- */

const equipmentSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		serialNumber: z.string().min(1, 'Serial number is required'),
		status: z.enum(['active', 'inactive', 'maintenance']),

		purchaseDate: z.string().min(1, 'Purchase date is required'),
		lastServiceDate: z.string().min(1, 'Last service date is required'),

		// pode ficar vazio -> vira undefined no payload
		nextServiceDate: z.string().optional(),

		// input type=number chega como string -> coerce resolve
		// default deixa o INPUT aceitar undefined, mas o OUTPUT vira number
		serviceIntervalDays: z.coerce.number().int().min(1).default(180),

		location: z.string().optional(),
		owner: z.string().optional()
	})
	.superRefine((values, ctx) => {
		const today = new Date();

		const purchase = values.purchaseDate ? parseISO(values.purchaseDate) : null;
		const last = values.lastServiceDate
			? parseISO(values.lastServiceDate)
			: null;

		const next =
			values.nextServiceDate && values.nextServiceDate.trim()
				? parseISO(values.nextServiceDate)
				: null;

		if (purchase && isAfter(purchase, today)) {
			ctx.addIssue({
				code: 'custom',
				path: ['purchaseDate'],
				message: 'Purchase date cannot be in the future'
			});
		}

		if (last && isAfter(last, today)) {
			ctx.addIssue({
				code: 'custom',
				path: ['lastServiceDate'],
				message: 'Last service date cannot be in the future'
			});
		}

		if (next && isBefore(next, today)) {
			ctx.addIssue({
				code: 'custom',
				path: ['nextServiceDate'],
				message: 'Next service date cannot be in the past'
			});
		}
	});

// ✅ Form usa o INPUT (o que vem do usuário)
type EquipmentFormValues = z.input<typeof equipmentSchema>;
// ✅ Output (após parse) tem defaults aplicados
type EquipmentParsedValues = z.output<typeof equipmentSchema>;

/* ---------------- FORM ---------------- */

export default function EquipmentForm({
	action,
	equipment
}: EquipmentFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<EquipmentFormValues>({
		resolver: zodResolver(equipmentSchema),
		defaultValues: {
			name: equipment?.name ?? '',
			serialNumber: equipment?.serialNumber ?? '',
			status: equipment?.status ?? 'active',

			purchaseDate: equipment?.purchaseDate ?? '',
			lastServiceDate: equipment?.lastServiceDate ?? '',

			nextServiceDate: equipment?.nextServiceDate ?? '',

			// aqui pode ser número, o schema coerce/default garante o resto
			serviceIntervalDays: equipment?.serviceIntervalDays ?? 180,

			location: equipment?.location ?? '',
			owner: equipment?.owner ?? ''
		},
		mode: 'onSubmit'
	});

	const createMutation = useMutation({
		mutationFn: createEquipment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['equipments'] });
			toast.success('Equipment created successfully');
			router.push('/equipments');
		},
		onError: () => toast.error('Failed to create equipment')
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Omit<Equipment, 'id'> }) =>
			updateEquipment(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['equipments'] });
			toast.success('Equipment updated successfully');
			router.push('/equipments');
		},
		onError: () => toast.error('Failed to update equipment')
	});

	const isSaving =
		action === 'add' ? createMutation.isPending : updateMutation.isPending;

	function onSubmit(values: EquipmentFormValues) {
		// ✅ aqui resolve TUDO: aplica default e garante types certinhos
		const parsed: EquipmentParsedValues = equipmentSchema.parse(values);

		const interval = parsed.serviceIntervalDays;

		const rawNext = parsed.nextServiceDate?.trim();
		let next: string | undefined = rawNext || undefined;

		if (!next && parsed.lastServiceDate) {
			const computed = addDays(parseISO(parsed.lastServiceDate), interval);
			next = format(computed, 'yyyy-MM-dd');
		}

		const payload: Omit<Equipment, 'id'> = {
			name: parsed.name,
			serialNumber: parsed.serialNumber,
			status: parsed.status,

			purchaseDate: parsed.purchaseDate,
			lastServiceDate: parsed.lastServiceDate,

			nextServiceDate: next,
			serviceIntervalDays: interval,

			location: parsed.location?.trim() || undefined,
			owner: parsed.owner?.trim() || undefined
		};

		if (action === 'add') createMutation.mutate(payload);

		if (action === 'edit' && equipment?.id) {
			updateMutation.mutate({ id: equipment.id, data: payload });
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 max-w-xl'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Asset Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. Hydraulic Dock Lift – Bay 1'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='serialNumber'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Serial Number</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. FL-TAM-DOCK-HYD-0001'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger disabled={isSaving}>
										<SelectValue placeholder='Select status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='active'>Active</SelectItem>
									<SelectItem value='inactive'>Inactive</SelectItem>
									<SelectItem value='maintenance'>Maintenance</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='purchaseDate'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Purchase Date</FormLabel>
								<FormControl>
									<Input
										type='date'
										disabled={isSaving}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='lastServiceDate'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Service Date</FormLabel>
								<FormControl>
									<Input
										type='date'
										disabled={isSaving}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
					<FormField
						control={form.control}
						name='nextServiceDate'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Next Service Date</FormLabel>
								<FormControl>
									<Input
										type='date'
										disabled={isSaving}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='serviceIntervalDays'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Service Interval (days)</FormLabel>
								<FormControl>
									<Input
										type='number'
										min={1}
										step={1}
										disabled={isSaving}
										value={field.value ?? 180}
										// manda string mesmo, o schema faz coerce
										onChange={(e) => field.onChange(e.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. Tampa DC'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='owner'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Owner</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isSaving}
									placeholder='e.g. Operations Team'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={isSaving}
				>
					{isSaving
						? action === 'add'
							? 'Creating...'
							: 'Updating...'
						: action === 'add'
						? 'Create Asset'
						: 'Update Asset'}
				</Button>
			</form>
		</Form>
	);
}
