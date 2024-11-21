
import React from 'react';
import { Typography, List, Divider, Box } from '@mui/material';
import { UserList } from './UserList';  
import { RoomList } from './RoomList';  
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from './store/userSlice';  

export default function UsersAndRoomsList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();  

    const handleUserClick = (userId) => {
        dispatch(setSelectedUser(userId));  
        navigate(`/messages/user/${userId}`);  
    };

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px', maxWidth: '30%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                Utilisateurs
            </Typography>
            <UserList onUserClick={handleUserClick} />

            <Divider sx={{ marginY: '20px' }} />

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                Salons
            </Typography>
            <RoomList />
        </Box>
    );
}
