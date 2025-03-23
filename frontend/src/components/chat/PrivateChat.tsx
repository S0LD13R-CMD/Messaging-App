import React, { useState } from 'react';
import { Message } from '../../types/messageTypes';
import { chatStyles } from '../../styles/chatStyles';

interface PrivateChatProps {
  recipientId: string;
  recipientName: string;
  senderName: string;
  messages?: Message[];
  onSendMessage?: (content: string) => void;
}

const PrivateChat: React.FC<PrivateChatProps> = ({ 
  recipientName, 
  senderName,
  messages = [],
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Call the parent component's onSendMessage handler
    if (onSendMessage) {
      onSendMessage(newMessage);
    }
    
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-xl font-bold mb-4 pt-4 px-4">
        Chat with {recipientName}
      </div>
      
      <div style={chatStyles.messagesArea}>
        {messages.map(message => (
          <div 
            key={message.id} 
            style={{
              ...chatStyles.messageContainer,
              ...(message.sender === senderName ? chatStyles.sentMessage : chatStyles.receivedMessage)
            }}
          >
            <div style={chatStyles.messageSender}>{message.sender}</div>
            <div style={chatStyles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </div>
            <div style={chatStyles.messageContent}>{message.content}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} style={chatStyles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          style={chatStyles.input}
          className="animated-input"
          placeholder={`Message to ${recipientName}...`}
        />
        <button 
          type="submit"
          style={chatStyles.sendButton}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default PrivateChat; 