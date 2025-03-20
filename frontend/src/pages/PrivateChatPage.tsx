import React, { useState, useEffect } from 'react';
import PrivateChat from '../components/chat/PrivateChat';
import { User } from '../types/messageTypes';
import Button from '../components/ui/Button';
import { chatStyles, userListStyles } from '../styles/chatStyles';

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
              onClick={() => setSelectedUser(user)}
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