'use client';

import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import PageHeader from '@/components/core/headers/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { Mail, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';

function getInitials(value?: string | null) {
	if (!value) return 'U';
	const parts = value.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? 'U';
	const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
	return (first + last).toUpperCase();
}

export default function AccountPage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(auth.currentUser);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setLoading(false);

			// Se não estiver logado, volta pro login
			if (!u) router.push('/login');
		});

		return () => unsub();
	}, [router]);

	const displayName = useMemo(() => {
		if (!user) return 'User';
		return user.displayName || user.email?.split('@')[0] || 'User';
	}, [user]);

	const email = user?.email ?? '';
	const uid = user?.uid ?? '';
	const provider = user?.providerData?.[0]?.providerId ?? 'password';
	const initials = getInitials(displayName);

	async function handleLogout() {
		try {
			await signOut(auth);
			toast.success('Logged out');
			router.push('/login');
		} catch {
			toast.error('Failed to log out');
		}
	}

	return (
		<section>
			<PageHeader
				pageTitle='Account'
				pageDescription='Profile and authentication details'
			/>

			<div className='p-4 md:p-6'>
				<div className='mx-auto w-full max-w-3xl space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<UserIcon className='h-5 w-5' />
								Profile
							</CardTitle>
						</CardHeader>

						<CardContent className='space-y-5'>
							{loading ? (
								<div className='space-y-3'>
									<Skeleton className='h-8 w-56' />
									<Skeleton className='h-4 w-80' />
									<Skeleton className='h-4 w-64' />
								</div>
							) : (
								<>
									<div className='flex items-start justify-between gap-4'>
										<div className='space-y-1'>
											<div className='flex items-center gap-3'>
												<div className='flex h-10 w-10 items-center justify-center rounded-lg border bg-muted text-sm font-semibold'>
													{initials}
												</div>
												<div>
													<p className='text-base font-semibold leading-5'>
														{displayName}
													</p>
													<p className='text-sm text-muted-foreground'>
														Logged in user
													</p>
												</div>
											</div>
										</div>

										<Badge
											variant='secondary'
											className='flex items-center gap-1'
										>
											<ShieldCheck className='h-4 w-4' />
											Authenticated
										</Badge>
									</div>

									<Separator />

									<div className='grid gap-4 md:grid-cols-2'>
										<div className='rounded-lg border p-4'>
											<p className='text-sm font-medium'>Email</p>
											<p className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
												<Mail className='h-4 w-4' />
												{email || '—'}
											</p>
										</div>

										<div className='rounded-lg border p-4'>
											<p className='text-sm font-medium'>Sign-in method</p>
											<p className='mt-1 text-sm text-muted-foreground'>
												{provider}
											</p>
										</div>

										<div className='rounded-lg border p-4 md:col-span-2'>
											<p className='text-sm font-medium'>User ID</p>
											<p className='mt-1 break-all font-mono text-xs text-muted-foreground'>
												{uid || '—'}
											</p>
										</div>
									</div>

									<div className='flex items-center justify-end'>
										<Button
											variant='destructive'
											onClick={handleLogout}
											className='gap-2'
										>
											<LogOut className='h-4 w-4' />
											Log out
										</Button>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Security</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2 text-sm text-muted-foreground'>
							<p>
								This demo uses Firebase Authentication for session-based access
								to protected routes.
							</p>
							<p>
								Account actions are intentionally minimal to keep the example
								production-oriented and easy to maintain.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
