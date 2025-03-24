import { useEffect, useState } from 'react';
import { getCookies } from '@configs/util';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookies<string>('accessToken');

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }, []);

  return {
    isLoggedIn,
    isLoading,
    setIsLoggedIn,
  };
};
