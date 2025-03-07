import React, { useState, useEffect } from 'react';
import { Message } from '../../types/messageTypes';
import { chatStyles } from '../../styles/chatStyles';

interface PrivateChatProps {
  recipientId: string;
  recipientName: string;
  senderName: string;
}

const PrivateChat: React.FC<PrivateChatProps> = ({ recipientId, recipientName, senderName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Here you would fetch private messages from your API
    // Example: fetchPrivateMessages(recipientId).then(data => setMessages(data));
    
    // For demonstration:
    const demoMessages: Message[] = [
      { 
        id: '1', 
        content: `Hello ${recipientName}!`, 
        sender: senderName, 
        receiver: recipientId,
        timestamp: new Date(Date.now() - 300000) 
      },
      { 
        id: '2', 
        content: 'Hi there! How are you?', 
        sender: recipientName, 
        receiver: senderName,
        timestamp: new Date(Date.now() - 240000) 
      }
    ];
    setMessages(demoMessages);
  }, [recipientId, recipientName, senderName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would send the private message to your API
    // Example: sendPrivateMessage(recipientId, newMessage).then(response => {});
    
    // For demonstration:
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: senderName,
      receiver: recipientId,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
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