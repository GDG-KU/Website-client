// src/store/loginSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface LoginState {
  isLoggedIn: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  isLoggedIn: false,
  token: null,
  loading: false,
  error: null,
};

//api/login 로 요청. 성공 시 토큰 반환
export const loginAsync = createAsyncThunk(
  'login/loginAsync',
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || '로그인 실패');
      }
      return data.token as string; // 토큰만
    } catch (error: unknown) {
        if (error instanceof Error) {
          return thunkAPI.rejectWithValue(error.message);
        }
        return thunkAPI.rejectWithValue('Unknown error occurred');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
