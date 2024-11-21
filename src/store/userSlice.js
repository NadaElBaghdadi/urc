import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    userDetails: {},
    selectedUser: null, 
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userDetails = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userDetails = {};
      state.selectedUser = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { login, logout, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
