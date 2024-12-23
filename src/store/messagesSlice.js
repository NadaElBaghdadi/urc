import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ receiverId, receiverType }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return rejectWithValue('Token missing');

      const response = await axios.get(`/api/messages?receiver_id=${receiverId}&receiver_type=${receiverType}`, {
        headers: {
          'Authentication': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

export const fetchMessagesGrp = createAsyncThunk(
  'messages/fetchMessagesGrp',
  async ({ receiverId, receiverType }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return rejectWithValue('Token missing');

      const response = await axios.get(`/api/messages?receiver_id=${receiverId}&receiver_type=${receiverType}`, {
        headers: {
          'Authentication': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

// Action pour envoyer un message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ( message , { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const senderId = Number(sessionStorage.getItem('id'));
      console.log("senderId",sessionStorage.getItem('id'))
      if (!token || !senderId) return rejectWithValue('Token or sender ID missing');

      console.log("message",message)

      const response = await axios.post(
        '/api/messages',
        {
          receiver_id: message.receiver_id,
          content: message.content,
          sender_id: message.sender_id,
          sender_name:message.sender_name,
          receiver_type: message.receiver_type,
        },
        {
          headers: {
            'Authentication': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
    listgrp: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.list.push(action.payload);
    },
    setMessages: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.list.push(action.payload); 
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addMessage } = messagesSlice.actions;

export const selectMessages = (state) => state.messages.list;
export const selectMessagesgrp = (state) => state.messages.listgrp;
export const selectMessagesLoading = (state) => state.messages.loading;
export const selectMessagesError = (state) => state.messages.error;

export default messagesSlice.reducer;
