'use client';
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { googleCallbackStoreAsync } from '@/store/authSlice';

export default function GoogleCallbackPage() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    //google/callback?access_token=xxx&refresh_token=yyy
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (access_token && refresh_token) {
      dispatch(
        googleCallbackStoreAsync({ 
          accessToken: access_token, 
          refreshToken: refresh_token 
        })
      );
      console.log('tokens:', { access_token, refresh_token });
    } else {
      console.log('No tokens found in query');
    }

    // redirect to home or wherever
    router.replace('/');
  }, [searchParams, router, dispatch]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Google OAuth Callback</h1>
      <p>토큰 파싱 중... 콘솔을 확인하세요.</p>
    </div>
  );
}