import { useState, useEffect } from 'react';
import { User } from '@/types';
import { userService } from '@/services/userService';

interface UseUserDataReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useUserData = (): UseUserDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await userService.refreshUser();
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, refresh };
};
