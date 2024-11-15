import React, { useEffect, useState } from 'react';

export function MessageList({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId) {
      fetch(`/api/messages/${roomId}`) // Assurez-vous que cette route existe et renvoie les messages du salon
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error('Erreur de chargement des messages', error));
    }
  }, [roomId]);

  return (
    <div>
      <h3>Messages</h3>
      {messages.length === 0 ? (
        <p>Aucun message dans ce salon.</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message.message_id}>
              <strong>{message.username}</strong>: {message.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessageList;
