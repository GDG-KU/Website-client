'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setIsLoggedIn } from '@/store/authSlice';
import { fetchWithAuth } from '@/utils/fetchWrapper';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function Providers({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile`, {
          method: 'GET',
        });
        if (res.ok) {
          dispatch(setIsLoggedIn(true));
        } else {
          dispatch(setIsLoggedIn(false));
        }
      } catch {
        dispatch(setIsLoggedIn(false));
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
