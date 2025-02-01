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
    // URL 예시: ?access_token=... (refresh token은 httpOnly 쿠키에 저장됨)
    const access_token = searchParams.get('access_token');

    if (access_token) {
      console.log('[GoogleCallbackPage] Access token:', access_token);
      // Redux에 access token 저장 (refresh token은 저장하지 않음)
      dispatch(googleCallbackStoreAsync({ accessToken: access_token }));
    } else {
      console.warn('[GoogleCallbackPage] 쿼리에 access token이 없습니다.');
    }

    // 토큰 저장 후 메인 페이지로 리다이렉트 (URL에서 토큰 정보를 제거)
    router.replace('/');
  }, [searchParams, router, dispatch]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Google OAuth Callback</h1>
      <p>토큰 파싱 중... 콘솔을 확인하세요.</p>
    </div>
  );
}
