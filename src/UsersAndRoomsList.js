import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from './UserList';
import { format } from 'date-fns';
import { fetchRooms } from './RoomList';  
import { Typography, List, ListItem, ListItemText, Divider, Avatar, Box, ListItemAvatar } from '@mui/material';
import {  useNavigate } from 'react-router-dom';  

export default function UsersAndRoomsList() {
    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/messages/user/${userId}`);
    };
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchAllUsers(
            (data) => setUsers(data),
            (error) => console.error('Erreur lors du chargement des utilisateurs:', error)
        );

        fetchRooms(
            (data) => setRooms(data),
            (error) => console.error('Erreur lors du chargement des salons:', error)
        );
    }, []);

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px' ,maxWidth:'30%'}}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
            Utilisateurs
        </Typography>
        <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {users.map((user) => (
                <ListItem key={user.user_id} onClick={() => handleUserClick(user.user_id)} sx={{ padding: '2px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '10px', boxShadow: 2 }}>
                    <ListItemAvatar>
                        <Avatar alt={user.username} src={`https://api.adorable.io/avatars/50/${user.username}.png`} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<strong>{user.username}</strong>}
                        secondary={<span style={{ color: '#757575', fontSize: '0.9em' }}>{user.last_login}</span>}
                    />
                </ListItem>
            ))}
        </List>

        <Divider sx={{ marginY: '20px' }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1c1c1c' }}>
                Salons
            </Typography>
            <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {rooms.map((room) => (
                    <ListItem key={room.room_id} sx={{ padding: '2px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '10px', boxShadow: 2 }}>
                        <ListItemAvatar>
                            <Avatar alt={room.name} sx={{ bgcolor: '#1976d2' }}>
                                {room.name[0]} 
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<strong>{room.name}</strong>}
                            secondary={<span style={{ color: '#757575', fontSize: '0.9em' }}>Créé le : {format(new Date(room.created_on), 'dd MMM yyyy, HH:mm')}</span>}
                        />
                    </ListItem>
                ))}
            </List>
    </Box>
    );
}

