'use client';

import { store } from '@/store/store';
import { logout, setAccessToken } from '@/store/authSlice';

async function refreshTokens(): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Refresh token request failed');
    }
    const data = await res.json();
    store.dispatch(setAccessToken(data.access_token));
    return data.access_token;
  } catch (err) {
    console.error('[refreshTokens] error:', err);
    store.dispatch(logout());
    throw err;
  }
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export async function fetchWithAuth(
  url: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken } = store.getState().auth;
  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'omit',
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
      refreshPromise = refreshTokens()
        .catch(() => '')
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
    }

    const newAccessToken = await refreshPromise;
    if (!newAccessToken) {
      return response;
    }

    const retryHeaders = new Headers(fetchOptions.headers);
    retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);

    const retryOptions: RequestInit = {
      ...fetchOptions,
      headers: retryHeaders,
    };

    try {
      response = await fetch(url, retryOptions);
    } catch (err) {
      console.error('[fetchWithAuth] retry fetch error:', err);
      throw err;
    }
  }

  return response;
}
