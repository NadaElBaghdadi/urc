import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    userDetails: {},
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userDetails = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userDetails = {};
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
