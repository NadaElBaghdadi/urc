import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import messageReducer from './messagesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messageReducer,
  },
});

export default store;
