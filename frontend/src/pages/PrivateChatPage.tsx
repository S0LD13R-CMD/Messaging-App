import React, { useState, useEffect } from 'react';
import PrivateChat from '../components/chat/PrivateChat';
import { User } from '../types/messageTypes';
import Button from '../components/ui/Button';

interface PrivateChatPageProps {
  username: string;
}

const PrivateChatPage: React.FC<PrivateChatPageProps> = ({ username }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Here you would fetch users from your API
    // For demonstration:
    const demoUsers: User[] = [
      { id: '1', username: 'Alice' },
      { id: '2', username: 'Bob' },
      { id: '3', username: 'Charlie' }
    ];
    setUsers(demoUsers);
  }, []);

  // Styling for the main container
  const containerStyle = {
    border: '2px solid rgb(255, 255, 255)',
    borderRadius: '24px',  // Increased rounded corners
    height: 'calc(100vh - 85px)',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    paddingTop: '10px',  // Add padding to the top inside the container
  };

  // Sidebar styling
  const sidebarStyle = {
    backgroundColor: 'black',
    color: 'white',
    paddingTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
  };


  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar with users */}
      <div className="w-64 shadow-md" style={sidebarStyle}>
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
              onClick={() => setSelectedUser(user)}
            >
              {user.username}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="px-5 py-6 sm:px-0 mx-auto flex-1">
        <div style={containerStyle}>
          {selectedUser ? (
            <PrivateChat 
              recipientId={selectedUser.id} 
              recipientName={selectedUser.username}
              senderName={username}
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