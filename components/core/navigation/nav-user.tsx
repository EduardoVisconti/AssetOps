'use client';

import { useEffect, useMemo, useState } from 'react';
import { signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar';

function getInitials(value?: string | null) {
	if (!value) return 'U';
	const parts = value.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? 'U';
	const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
	return (first + last).toUpperCase();
}

export function NavUser() {
	const router = useRouter();
	const { isMobile } = useSidebar();

	const [fbUser, setFbUser] = useState<User | null>(auth.currentUser);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => setFbUser(u));
		return () => unsub();
	}, []);

	const displayName = useMemo(() => {
		if (!fbUser) return 'User';
		return fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
	}, [fbUser]);

	const email = fbUser?.email ?? 'Not signed in';
	const avatarUrl = fbUser?.photoURL ?? undefined;
	const initials = getInitials(displayName);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage
									src={avatarUrl}
									alt={displayName}
								/>
								<AvatarFallback className='rounded-lg'>
									{initials}
								</AvatarFallback>
							</Avatar>

							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>{displayName}</span>
								<span className='truncate text-xs'>{email}</span>
							</div>

							<ChevronsUpDown className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={avatarUrl}
										alt={displayName}
									/>
									<AvatarFallback className='rounded-lg'>
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>{displayName}</span>
									<span className='truncate text-xs'>{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => router.push('/account')}>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={async () => {
								try {
									await signOut(auth);
									toast.success('Logged out');
									router.push('/login');
								} catch {
									toast.error('Failed to log out');
								}
							}}
						>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
