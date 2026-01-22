'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types/user-profile';
import { ensureUserProfile, getUserProfile } from '@/data-access/users';

export function useUserRole() {
	const { user, loading } = useAuth();
	const uid = user?.uid;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['user-profile', uid],
		queryFn: async () => {
			if (!uid) return null;

			// Attempt read
			const existing = await getUserProfile(uid);
			if (existing) return existing;

			// Create-on-first-login (viewer)
			const email = user?.email;
			if (!email) {
				// If user has no email (rare for email/password), fail gracefully
				return { uid, email: '', role: 'viewer' as const };
			}

			return ensureUserProfile({ uid, email });
		},
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
