'use client';

import { useQuery } from '@tanstack/react-query';
import type { JWTPayload } from '@/src/library/auth';

export function useAuth() {
  const { data: user, isLoading: loading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json() as Promise<JWTPayload>;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user: user || null, loading, error };
}
