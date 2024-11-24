import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from './store/messagesSlice';
import { useParams } from 'react-router-dom';
import UsersAndRoomsList from './UsersAndRoomsList';
import { TextField, Button, Box, Typography, AppBar, Toolbar, List } from '@mui/material';

export const Chat = () => {
  const { userId, roomId } = useParams(); 
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const { list: messages, loading, error } = useSelector((state) => state.messages);

  const receiverType = userId ? 'user' : 'room';
  const receiverId = userId || roomId;

  useEffect(() => {
    console.log(`Receiver ID: ${receiverId}, Receiver Type: ${receiverType}`);
  }, [receiverId, receiverType]);

  useEffect(() => {
    if (receiverId) {
      dispatch(fetchMessages({ receiverId: Number(receiverId), receiverType }));
    }
  }, [dispatch, receiverId, receiverType]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !receiverId) return;
    console.log('dispatch', dispatch(
      sendMessage({
        receiver_id: Number(receiverId),
        receiver_type :receiverType,
        content: newMessage.trim(),
        sender_id: Number(sessionStorage.getItem('id')),
        sender_name: sessionStorage.getItem('username'),
      })
    ));



    setNewMessage('');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Ubo Relay Chat
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
          <UsersAndRoomsList />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {loading ? (
              <Typography>Chargement des messages...</Typography>
            ) : error ? (
              <Typography color="error">Erreur lors du chargement des messages.</Typography>
            ) : (
              <List sx={{ padding: 0 }}>
                {messages
                  .filter((message) =>
                    receiverType === 'user'
                      ? (message.sender_id === Number(sessionStorage.getItem('id')) &&
                          message.receiver_id === Number(receiverId)) ||
                        (message.sender_id === Number(receiverId) &&
                          message.receiver_id === Number(sessionStorage.getItem('id')))
                      : message.receiver_id === Number(receiverId) && message.receiver_type === 'room'
                  )
                  .map((message) => (
                    <Box
                      key={message.message_id}
                      sx={{
                        display: 'flex',
                        justifyContent:
                          message.sender_id === Number(sessionStorage.getItem('id')) ? 'flex-end' : 'flex-start',
                        marginBottom: '10px',
                      }}
                    >
                     <Box sx={{
    maxWidth: '60%',
    padding: '5px',
    borderRadius: '8px',
    backgroundColor:
      message.sender_id === Number(sessionStorage.getItem('id')) ? '#1976d2' : '#f5f5f5',
    color: message.sender_id === Number(sessionStorage.getItem('id')) ? 'white' : 'black',
  }}
>
  <Typography
    variant="subtitle2"
    sx={{
      fontWeight: 'bold',
      color: message.sender_id === Number(sessionStorage.getItem('id')) ? 'white' : 'black',
      marginBottom: '5px',
    }}
  >
    {message.sender_name}
  </Typography>

  <Typography variant="body2">{message.content}</Typography>

  <Typography
    variant="caption"
    sx={{
      display: 'block',
      marginTop: '5px',
      color: message.sender_id === Number(sessionStorage.getItem('id')) ? '#ddd' : '#888',
    }}
  >
{new Date(message.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}{' '}
{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  </Typography>
</Box>

                    </Box>
                  ))}
              </List>
            )}
          </Box>

          <Box
            sx={{
              padding: '10px',
              borderTop: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tapez votre message ici..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
              Envoyer
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
