import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { format } from 'date-fns';

export const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = (onResult, onError) => {
      fetch("/api/rooms", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        if (response.ok) {
          const rooms = await response.json();
          onResult(rooms);
        } else {
          const error = await response.json();
          onError(error);
        }
      })
      .catch(onError);
    };

    fetchRooms(
      (result) => setRooms(result),
      (err) => setError(err)
    );
  }, []);

  if (error) {
    return <div>Erreur lors du chargement des salles : {error.message || 'Erreur inconnue'}</div>;
  }

  return (
    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
      {rooms.map((room) => (
        <ListItem
          key={room.room_id}
          sx={{ padding: '2px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '10px', boxShadow: 2 }}
        >
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
  );
};

