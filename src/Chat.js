import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from './store/messagesSlice';
import { useParams } from 'react-router-dom';
import UsersAndRoomsList from './UsersAndRoomsList';
import {TextField, Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const Chat = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { list: messages, loading, error } = useSelector((state) => state.messages);
  const [newMessage, setNewMessage] = useState('');
  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); 
    sessionStorage.removeItem("id"); 
    sessionStorage.removeItem("username"); 

    window.location.href = "/";
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages({ receiverId: Number(userId), receiverType: 'user' }));
    }
  }, [dispatch, userId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('dispatch',dispatch(sendMessage({ receiverId: Number(userId), content: newMessage.trim() })));

    setNewMessage('');
  };

  return (
    
    <div style={{display:"flex",flex:"column" , flexDirection : "column" }} className="flex column">
    <div className="w-[30%] bg-white border-r border-gray-300">
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Ubo Relay Chat
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
      <UsersAndRoomsList />
    </div>
  
    <div  className="w-[70%] flex flex-col">
      <div className=" p-4 overflow-y-auto pb-24">
        {loading ? (
          <div>Chargement des messages...</div>
        ) : error ? (
          <div>Erreur lors du chargement des messages</div>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message.message_id}
                className={`flex ${message.sender_id === Number(sessionStorage.getItem('id')) ? 'justify-end' : ''}`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.sender_id === Number(sessionStorage.getItem('id'))
                      ? 'bg-blue-300 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '10px' }}
      >
        <TextField
          variant="outlined"
          placeholder="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
          multiline
          maxRows={3}
          sx={{ flex: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          className="h-10"
          sx={{ minWidth: '150px', height: '40px' }}
        >
          Envoyer
        </Button>
      </div>
    </div>
  </div>
  
  );
};

export default Chat;
