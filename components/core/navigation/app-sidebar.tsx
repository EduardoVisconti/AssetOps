'use client';

import * as React from 'react';
import { LayoutDashboard, Wrench, LineChart } from 'lucide-react';

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
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
