import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/** Redux 상태 구조 */
interface AuthState {
  isLoggedIn: boolean;          // 로그인 여부
  token: string | null;         // 일반 로그인 용 (JWT) 
  accessToken: string | null;   // 구글 OAuth용 Access Token
  refreshToken: string | null;  // 구글 OAuth용 Refresh Token
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** 
 * (A) 일반 로그인 
 * POST /api/login
 * body: { username, password }
 * resp: { success: boolean, token?: string, message? }
 */
export const normalLoginAsync = createAsyncThunk(
  'auth/normalLoginAsync',
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json(); // { success, token, message? }
      if (!data.success) {
        throw new Error(data.message || '로그인 실패');
      }
      return data.token as string;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI.rejectWithValue('Unknown error occurred');
    }
  }
);

/**
 * (B) 구글 OAuth 콜백
 * GET /auth/google/callback
 * resp: { access_token, refresh_token }
 */
export const googleCallbackStoreAsync = createAsyncThunk(
    'auth/googleCallbackStoreAsync',
    async (
      { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
      thunkAPI
    ) => {
        const state = thunkAPI.getState();
        console.log('현재 Redux 상태:', state);
        
      return { accessToken, refreshToken };
    }
  );

/**
 * (C) 토큰 재발급 
 * POST /auth/refresh
 * body: { refresh_token }
 * resp: { access_token, refresh_token }
 */
export const refreshTokenAsync = createAsyncThunk(
    'auth/refreshTokenAsync',
    async (refreshToken: string, thunkAPI) => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json(); // { access_token, refresh_token }
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          return thunkAPI.rejectWithValue(err.message);
        }
        return thunkAPI.rejectWithValue('Unknown error occurred');
      }
    }
  );

  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      // 로그아웃
      logout(state) {
        state.isLoggedIn = false;
        state.token = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = false;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // (A) 일반 로그인
        .addCase(normalLoginAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(normalLoginAsync.fulfilled, (state, action) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.token = action.payload; // e.g. JWT
          console.log('일반 로그인 token=', action.payload);
        })
        .addCase(normalLoginAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
  
        // (B) 구글 콜백 Store
        .addCase(googleCallbackStoreAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(googleCallbackStoreAsync.fulfilled, (state, action) => {
          state.loading = false;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          console.log('google OAuth tokens=', action.payload);
        })
        .addCase(googleCallbackStoreAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
  
        // (C) 토큰 재발급
        .addCase(refreshTokenAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(refreshTokenAsync.fulfilled, (state, action) => {
          state.loading = false;
          state.accessToken = action.payload.access_token;
          state.refreshToken = action.payload.refresh_token;
          console.log('refresh new tokens=', action.payload);
        })
        .addCase(refreshTokenAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;