'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types/user-profile';
import { ensureUserProfile, getUserProfile } from '@/data-access/users';

export function useUserRole() {
	const { user, loading } = useAuth();

	const uid = user?.uid;
	const email = user?.email ?? '';

	// Ensure profile doc exists (v1: creates as viewer)
	useEffect(() => {
		if (!loading && user?.uid && user.email) {
			ensureUserProfile(user.uid, user.email).catch(() => {
				// swallow to avoid noisy UI; reads will surface issues
			});
		}
	}, [loading, user?.uid, user?.email]);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['user-profile', uid],
		queryFn: () => (uid ? getUserProfile(uid) : Promise.resolve(null)),
		enabled: Boolean(uid)
	});

	const role: UserRole = data?.role ?? 'viewer';

	return {
		role,
		isAdmin: role === 'admin',
		isLoading: loading || isLoading,
		isError
	};
}
