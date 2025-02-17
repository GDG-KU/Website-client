'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { setIsLoggedIn } from '@/store/authSlice';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function AuthStatusChecker() {
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

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthStatusChecker />
      {children}
    </Provider>
  );
}
