import { useEffect, useState } from 'react';
import { authService } from '@/services/auth';
import { getToken, removeToken } from '@/utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const load = async () => {
      if (getToken()) {
        try {
          const me = await authService.me();
          setUser(me);
        } catch {
          removeToken();
          setUser(null);
        }
      }
    };
    load();
  }, []);

  return { user, setUser };
};

export default useAuth;
