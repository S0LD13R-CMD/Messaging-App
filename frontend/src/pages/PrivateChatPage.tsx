import React, { useState, useEffect } from 'react';
import PrivateChat from '../components/chat/PrivateChat';
import { User, Message } from '../types/messageTypes';
import Button from '../components/ui/Button';
import { chatStyles, userListStyles } from '../styles/chatStyles';

interface PrivateChatPageProps {
  username: string;
  onNewMessage?: () => void;
  clearNotifications?: () => void;
}

const PrivateChatPage: React.FC<PrivateChatPageProps> = ({ 
  username, 
  onNewMessage,
  clearNotifications 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: boolean }>({});
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});

  useEffect(() => {
    // Call clearNotifications when component mounts
    if (clearNotifications) {
      clearNotifications();
    }
    
    // Here you would fetch users from your API
    // For demonstration:
    const demoUsers: User[] = [
      { id: '1', username: 'Alice' },
      { id: '2', username: 'Bob' },
      { id: '3', username: 'Charlie' }
    ];
    setUsers(demoUsers);
    
    // Initialize empty messages for each user
    const initialMessages: { [key: string]: Message[] } = {};
    demoUsers.forEach(user => {
      initialMessages[user.id] = [
        { 
          id: '1', 
          content: `Hello ${user.username}!`, 
          sender: username, 
          receiver: user.id,
          timestamp: new Date(Date.now() - 300000) 
        },
        { 
          id: '2', 
          content: 'Hi there! How are you?', 
          sender: user.username, 
          receiver: username,
          timestamp: new Date(Date.now() - 240000) 
        }
      ];
    });
    setMessages(initialMessages);
    
    // Simulate Alice sending a message after 5 seconds
    const timer = setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        content: 'Hey there! Do you have a minute to talk?',
        sender: 'Alice',
        receiver: username,
        timestamp: new Date()
      };
      
      // Add to Alice's messages
      setMessages(prev => ({
        ...prev,
        '1': [...prev['1'], newMessage]
      }));
      
      // Only set as unread if not currently viewing Alice's chat
      if (!selectedUser || selectedUser.id !== '1') {
        // Mark as unread locally
        setUnreadMessages(prev => ({ ...prev, '1': true }));
        
        // Notify App component about unread message
        if (onNewMessage) {
          onNewMessage();
        }
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [username, selectedUser, onNewMessage, clearNotifications]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    // Clear unread indicator for this user
    setUnreadMessages(prev => ({ ...prev, [user.id]: false }));
  };

  const handleNewMessage = (userId: string, content: string) => {
    // Create a new message
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender: username,
      receiver: userId,
      timestamp: new Date()
    };
    
    // Add to messages
    setMessages(prev => ({
      ...prev,
      [userId]: [...prev[userId], newMessage]
    }));
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar with users */}
      <div className="w-64 shadow-md" style={userListStyles.sidebarStyle}>
        <div className="p-4 font-bold text-lg border-b text-white text-center mb-4">
          Private Messages
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)] px-4">
          {users.map(user => (
            <Button
              key={user.id}
              fullWidth
              animation="slide"
              variant={selectedUser?.id === user.id ? 'selected' : 'default'}
              className={unreadMessages[user.id] ? 'unread-message' : ''}
              onClick={() => handleSelectUser(user)}
            >
              {user.username}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="px-5 py-6 sm:px-0 mx-auto flex-1">
        <div style={chatStyles.containerStyle2}>
          {selectedUser ? (
            <PrivateChat 
              recipientId={selectedUser.id} 
              recipientName={selectedUser.username}
              senderName={username}
              messages={messages[selectedUser.id]}
              onSendMessage={(content) => handleNewMessage(selectedUser.id, content)}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChatPage; 