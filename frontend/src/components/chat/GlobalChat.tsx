import React, { useState, useEffect } from 'react';
import { Message } from '../../types/messageTypes';
import { chatStyles } from '../../styles/chatStyles';
import '../../styles/buttonAnimations.css';
import Button from '../ui/Button';

interface GlobalChatProps {
  username: string;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Here you would fetch messages from your API
    // Example: fetchGlobalMessages().then(data => setMessages(data));
    
    // For demonstration:
    const demoMessages: Message[] = [
      { id: '1', content: 'Welcome to the global chat!', sender: 'System', timestamp: new Date() }
    ];
    setMessages(demoMessages);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would send the message to your API
    // Example: sendGlobalMessage(newMessage).then(response => {});
    
    // For demonstration:
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: username, // Use the actual username
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Custom style for system messages with typewriter effect
  const systemMessageStyle = {
    ...chatStyles.messageContainer,
    ...chatStyles.receivedMessage,
    borderColor: 'rgb(96, 0, 175)',
    textAlign: 'center' as const,
    maxWidth: '20%',
    margin: '10px auto'
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-xl font-bold mb-4"></div>
      
      <div style={chatStyles.messagesArea}>
        {messages.map(message => (
          <div 
            key={message.id} 
            style={
              message.sender === 'System' 
                ? systemMessageStyle
                : {
                    ...chatStyles.messageContainer,
                    ...(message.sender === username ? chatStyles.sentMessage : chatStyles.receivedMessage)
                  }
            }
          >
            <div style={chatStyles.messageSender}>{message.sender}</div>
            <div style={chatStyles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </div>
            <div 
              style={chatStyles.messageContent} 
              className={message.sender === 'System' ? 'typewriter-delay' : ''}
            >
              {message.content}
            </div>
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
          placeholder="Your yapping goes here..."
        />
        <Button 
          type="submit"
          animation="slide"
          margin="0 0 0 10px"
          padding="8px 16px"
          border="2px solid rgb(62, 0, 100)"
        >
          Yap
        </Button>
      </form>
    </div>
  );
};

export default GlobalChat; 