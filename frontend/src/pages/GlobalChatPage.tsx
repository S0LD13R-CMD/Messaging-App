import React from 'react';
import GlobalChat from '../components/chat/GlobalChat';

interface GlobalChatPageProps {
  username: string;
}

const GlobalChatPage: React.FC<GlobalChatPageProps> = ({ username }) => {
  // Styling for the main container
  const containerStyle = {
    border: '2px solid rgb(255, 255, 255)',
    borderRadius: '12px',  // Increased rounded corners
    height: 'calc(100vh - 200px)',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Global Chat</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div style={containerStyle}>
              <GlobalChat username={username} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GlobalChatPage; 