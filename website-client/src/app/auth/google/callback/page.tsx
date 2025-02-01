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
    // 백엔드에서 /auth/google/callback으로 진입 후
    // 최종적으로 프론트엔드에 ?access_token=...&refresh_token=...
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (access_token && refresh_token) {
      console.log('[GoogleCallbackPage] 토큰 확인:', {
        access_token,
        refresh_token,
      });

      // Redux에 저장
      dispatch(
        googleCallbackStoreAsync({
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      );
    } else {
      console.warn('[GoogleCallbackPage] 쿼리에 토큰이 없습니다.');
    }

    // 이후 메인 페이지 또는 다른 페이지로 리다이렉트
    router.replace('/');
  }, [searchParams, router, dispatch]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Google OAuth Callback</h1>
      <p>토큰 파싱 중... 콘솔을 확인하세요.</p>
    </div>
  );
}
