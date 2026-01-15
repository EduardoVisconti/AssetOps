'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AppSidebar } from '@/components/core/navigation/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import EquipmentDashboardQueryClientProvider from '@/components/providers/query-provider';
import { useAuth } from '@/context/auth-context';
import { CommandPalette } from '@/components/core/overlays/command-palette';

export default function PrivateLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.replace('/login');
		}
	}, [loading, user, router]);

	// 1) checando sessão
	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<p className='text-sm text-muted-foreground'>Checking session…</p>
			</div>
		);
	}

	// 2) não logado -> mostra "redirecting" (NÃO retorna null)
	if (!user) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<p className='text-sm text-muted-foreground'>Redirecting to login…</p>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<EquipmentDashboardQueryClientProvider>
				<AppSidebar />
				<SidebarInset>
					<CommandPalette />
					{children}
				</SidebarInset>
			</EquipmentDashboardQueryClientProvider>
		</SidebarProvider>
	);
}
