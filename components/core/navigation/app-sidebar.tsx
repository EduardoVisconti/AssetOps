'use client';

import * as React from 'react';
import { LayoutDashboard, Wrench, LineChart } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useUserRole } from '@/hooks/use-user-role';
import { Badge } from '@/components/ui/badge';

import { NavMain } from '@/components/core/navigation/nav-main';
import { NavUser } from '@/components/core/navigation/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar
} from '@/components/ui/sidebar';
import Link from 'next/link';

const data = {
	user: {
		name: 'User',
		email: 'user@example.com',
		avatar: '/avatars/shadcn.jpg'
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboard
		},
		{
			title: 'Equipments',
			url: '/equipments',
			icon: Wrench
		},
		{
			title: 'Analytics',
			url: '/analytics',
			icon: LineChart
		}
	]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { open } = useSidebar();
	const { user } = useAuth();
	const { role, isAdmin, isLoading: roleLoading } = useUserRole();

	return (
		<Sidebar
			collapsible='icon'
			{...props}
		>
			<SidebarHeader className='h-[60px] border-b flex items-center justify-center'>
				<Link href={'/dashboard'}>
					{open ? (
						<p className='text-base font-mono font-extrabold'>AssetOps</p>
					) : (
						<p className='bg-primary h-[20px] w-[20px] text-xs rounded-sm flex items-center justify-center text-background'>
							AO
						</p>
					)}
				</Link>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
				<div className='mt-auto border-t p-3'>
					<div className='flex items-center justify-between gap-2'>
						<div className='min-w-0'>
							<p className='mt-2 text-[11px] text-muted-foreground'>
								{isAdmin ? 'Full access' : 'Read-only access'}
							</p>
						</div>

						<Badge variant={isAdmin ? 'secondary' : 'outline'}>
							{roleLoading ? '…' : role.toUpperCase()}
						</Badge>
					</div>
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
