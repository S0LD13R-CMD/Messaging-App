import React, { useState, useEffect } from 'react';
import PrivateChat from '../components/chat/PrivateChat';
import { User } from '../types/messageTypes';

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
      { id: '1', username: 'Alice', isOnline: true },
      { id: '2', username: 'Bob', isOnline: true },
      { id: '3', username: 'Charlie', isOnline: false }
    ];
    setUsers(demoUsers);
  }, []);

  // Styling for the main container
  const containerStyle = {
    border: '2px solid #CBD5E0',
    borderRadius: '24px',  // Increased rounded corners
    height: 'calc(100vh - 64px)',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with users */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-lg border-b">
          Private Messages
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {users.map(user => (
            <div 
              key={user.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser?.id === user.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className={`h-3 w-3 rounded-full inline-block ${
                    user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-6">
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