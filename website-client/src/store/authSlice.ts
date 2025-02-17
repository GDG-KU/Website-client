import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
      if (!action.payload) {
        state.accessToken = null;
      }
    },
    logout(state) {
      state.accessToken = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setAccessToken, setIsLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
