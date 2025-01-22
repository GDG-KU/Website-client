'use client';

import { store } from '@/store/store';
import { refreshTokenAsync, logout } from '@/store/authSlice';

let isRefreshing = false;

export async function fetchWithAuth(url: RequestInfo, options?: RequestInit): Promise<Response> {
  // 1) Redux에서 토큰 읽기
  const state = store.getState().auth;
  const accessToken = state.accessToken || state.token; // 일반 로그인 or 구글 OAuth

  // 2) 헤더 구성
  const headers = new Headers(options?.headers || {});

  // FormData인지 확인 → FormData면 'Content-Type' 자동 설정 X
  // 그렇지 않다면 JSON 헤더 지정
  if (!(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Authorization
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 요청 옵션 재구성
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  // 3) 첫 요청
  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    console.error('[fetchWithAuth] fetch error:', err);
    throw err;
  }

  // 4) 401 → 토큰 만료 가정 → refresh 시도
  if (response.status === 401) {
    const refreshT = state.refreshToken;
    if (refreshT) {
      if (!isRefreshing) {
        isRefreshing = true;
        console.log('[fetchWithAuth] 401 detected. Trying refresh...');
        const resultAction = await store.dispatch(refreshTokenAsync(refreshT));
        isRefreshing = false;

        if (refreshTokenAsync.fulfilled.match(resultAction)) {
          // 재시도
          const newState = store.getState().auth;
          const newAccessToken = newState.accessToken || newState.token;
          const retriedHeaders = new Headers(options?.headers || {});

          // 다시 FormData인지 확인
          if (!(options?.body instanceof FormData)) {
            retriedHeaders.set('Content-Type', 'application/json');
          }

          if (newAccessToken) {
            retriedHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          }

          try {
            response = await fetch(url, { ...options, headers: retriedHeaders });
          } catch (err) {
            console.error('[fetchWithAuth] retry fetch error:', err);
            throw err;
          }
        } else {
          console.warn('[fetchWithAuth] refresh token failed. Logging out...');
          store.dispatch(logout());
        }
      } else {
        // 이미 refresh 진행중 → 대기 로직 etc.
        console.log('[fetchWithAuth] refresh in progress. Possibly queue or wait...');
      }
    } else {
      // refreshToken 없음 → session expired
      console.warn('[fetchWithAuth] no refreshToken => session expired. Logging out.');
      store.dispatch(logout());
    }
  }

  return response;
}
