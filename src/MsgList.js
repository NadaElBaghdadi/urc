import React from 'react';

export const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.message_id} className="message-item">
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}
    </div>
  );
};
