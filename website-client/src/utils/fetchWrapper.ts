'use client';

import { store } from '@/store/store';
import { refreshTokenAsync, logout } from '@/store/authSlice';

let isRefreshing = false;

/**
 * 인증이 필요한 API 호출 함수
 * - Redux 상태에서 access token을 읽어 Authorization 헤더에 추가
 * - 401 응답 시 /auth/refresh 호출 (credentials: 'include'로 httpOnly 쿠키 전송)
 * - 재발급 성공 시 토큰 갱신 후 재시도
 */
export async function fetchWithAuth(url: RequestInfo, options?: RequestInit): Promise<Response> {
  const state = store.getState().auth;
  const accessToken = state.accessToken || state.token;

  const headers = new Headers(options?.headers || {});
  if (!(options?.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  const fetchOptions: RequestInit = { ...options, headers, credentials: 'include' };

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    console.error('[fetchWithAuth] fetch error:', err);
    throw err;
  }

  // 401 발생 시 access token 만료로 간주하고 refresh 시도
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.log('[fetchWithAuth] 401 detected. Trying refresh...');
      const resultAction = await store.dispatch(refreshTokenAsync());
      isRefreshing = false;

      if (refreshTokenAsync.fulfilled.match(resultAction)) {
        // 갱신된 토큰으로 재요청
        const newState = store.getState().auth;
        const newAccessToken = newState.accessToken || newState.token;
        const retriedHeaders = new Headers(options?.headers || {});
        if (!(options?.body instanceof FormData)) {
          if (!retriedHeaders.has('Content-Type')) {
            retriedHeaders.set('Content-Type', 'application/json');
          }
        }
        if (newAccessToken) {
          retriedHeaders.set('Authorization', `Bearer ${newAccessToken}`);
        }
        try {
          response = await fetch(url, { ...options, headers: retriedHeaders, credentials: 'include' });
        } catch (err) {
          console.error('[fetchWithAuth] retry fetch error:', err);
          throw err;
        }
      } else {
        console.warn('[fetchWithAuth] Refresh token failed. Logging out...');
        store.dispatch(logout());
      }
    } else {
      console.log('[fetchWithAuth] Refresh in progress. Please wait...');
    }
  }

  return response;
}
