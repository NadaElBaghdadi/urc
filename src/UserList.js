


import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

export const UserList = ({ onUserClick }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = (onResult, onError) => {
      const currentUsername = sessionStorage.getItem('username');

      fetch("/api/users", {
        method: "GET",
        headers: {
          "Authentication": `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        if (response.ok) {
          const users = await response.json();
          const filteredUsers = users.filter(user => user.username !== currentUsername);
          onResult(filteredUsers);
        } else {
          const error = await response.json();
          onError(error);
        }
      })
      .catch(onError);
    };

    fetchAllUsers(
      (result) => setUsers(result),
      (err) => setError(err)
    );
  }, []);

  if (error) {
    return <div>Erreur lors du chargement des utilisateurs : {error.message || 'Erreur inconnue'}</div>;
  }

  return (
    <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
      {users.map((user) => (
        <ListItem
          key={user.user_id}
          onClick={() => onUserClick && onUserClick(user.user_id)}
          sx={{ padding: '2px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '10px', boxShadow: 2 }}
        >
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
  );
};
