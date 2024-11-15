import React, { useState } from 'react';
import UserList from './UserList';
import RoomList from './RoomList';
import MessageList from './MessageList';

export function MessagingApp() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div>
      <h1>Messagerie</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '20px' }}>
          <UserList onUserSelect={handleUserSelect} />
        </div>
        <div style={{ marginRight: '20px' }}>
          <RoomList onRoomSelect={handleRoomSelect} />
        </div>
        <div>
          {selectedRoom && <MessageList roomId={selectedRoom.room_id} />}
        </div>
      </div>
    </div>
  );
}

export default MessagingApp;
