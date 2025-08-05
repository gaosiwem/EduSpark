'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeAccessToken, setUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const email = searchParams.get('email');

    if (accessToken && email) {
      storeAccessToken(accessToken);
      setUser({ email }); // Add more user fields if available
      router.replace('/');
    } else {
      // Handle error (missing token)
      router.replace('/login?error=oauth');
    }
  }, [router, searchParams, storeAccessToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span>Signing you in...</span>
    </div>
  );
}