// src/utils/fetchWrapper.ts
'use client';

import { store } from '@/store/store';
import { logout } from '@/store/authSlice';

let isRefreshing = false;

export async function fetchWithAuth(
  url: RequestInfo,
  options?: RequestInit
): Promise<Response> {
  const headers = new Headers(options?.headers || {});
  if (!(options?.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    console.error('[fetchWithAuth] fetch error:', err);
    throw err;
  }

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.log('[fetchWithAuth] 401 detected. Trying /auth/refresh...');
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        isRefreshing = false;

        if (refreshRes.ok) {
          console.log('[fetchWithAuth] Refresh success. Retrying original request...');
          try {
            response = await fetch(url, fetchOptions);
          } catch (retryErr) {
            console.error('[fetchWithAuth] retry fetch error:', retryErr);
            throw retryErr;
          }
        } else {
          console.warn('[fetchWithAuth] Refresh token failed. Logging out...');
          store.dispatch(logout());
        }
      } catch (refreshErr) {
        console.error('[fetchWithAuth] refresh request error:', refreshErr);
        store.dispatch(logout());
      }
    } else {
      console.log('[fetchWithAuth] Refresh in progress. Please wait...');
    }
  }

  return response;
}
