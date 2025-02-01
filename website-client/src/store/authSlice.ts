import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/** Redux 상태 구조 */
interface AuthState {
  isLoggedIn: boolean;          // 로그인 여부
  token: string | null;         // 일반 로그인용 JWT
  accessToken: string | null;   // 구글 OAuth용 Access Token
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  accessToken: null,
  loading: false,
  error: null,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const normalLoginAsync = createAsyncThunk(
  'auth/normalLoginAsync',
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      if (!API_BASE_URL) throw new Error('API_BASE_URL is not defined');
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json(); // { success, token, message? }
      if (!data.success) throw new Error(data.message || '로그인 실패');
      return data.token as string;
    } catch (err: unknown) {
      if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
      return thunkAPI.rejectWithValue('Unknown error occurred');
    }
  }
);

/**
 * (B) 구글 OAuth 콜백: access token만 저장 (refresh token은 httpOnly 쿠키에 있음)
 */
export const googleCallbackStoreAsync = createAsyncThunk(
  'auth/googleCallbackStoreAsync',
  async ({ accessToken }: { accessToken: string }, thunkAPI) => {
    console.log(thunkAPI)
    return { accessToken };
  }
);

/**
 * (C) 토큰 재발급: 백엔드에서 httpOnly 쿠키에 저장된 refresh token을 사용
 * 요청 시 credentials 옵션을 'include'로 설정하여 쿠키를 전송함
 */
export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshTokenAsync',
  async (_, thunkAPI) => {
    try {
      if (!API_BASE_URL) throw new Error('API_BASE_URL is not defined');
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // httpOnly 쿠키 전송
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json(); // { access_token }
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
      return thunkAPI.rejectWithValue('Unknown error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그아웃 시 Redux 상태 초기화 (백엔드에서 쿠키 삭제 처리는 별도 구현 필요)
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.accessToken = null;
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
        state.token = action.payload; // 일반 로그인 JWT
      })
      .addCase(normalLoginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // (B) 구글 OAuth 콜백 저장 (access token만 저장)
      .addCase(googleCallbackStoreAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleCallbackStoreAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(googleCallbackStoreAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // (C) 토큰 재발급 (access token만 갱신)
      .addCase(refreshTokenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
