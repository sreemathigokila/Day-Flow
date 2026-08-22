import { createSlice } from '@reduxjs/toolkit';

const initialUser = JSON.parse(localStorage.getItem('dayflow_user') || 'null');
const initialToken = localStorage.getItem('dayflow_token') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('dayflow_token', action.payload.token);
      localStorage.setItem('dayflow_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
