'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types/user-profile';
import { getUserProfile } from '@/data-access/users';

export function useUserRole() {
	const { user, loading } = useAuth();

	const uid = user?.uid;

	const { data, isLoading, isError } = useQuery({
		queryKey: ['user-profile', uid],
		queryFn: () => (uid ? getUserProfile(uid) : Promise.resolve(null)),
		enabled: Boolean(uid)
	});

	// Se não existir profile ainda: trata como viewer (read-only)
	const role: UserRole = data?.role ?? 'viewer';

	return {
		role,
		isAdmin: role === 'admin',
		isLoading: loading || isLoading,
		isError
	};
}
