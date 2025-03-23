import React from 'react';
import GlobalChat from '../components/chat/GlobalChat';
import { chatStyles } from '../styles/chatStyles';

interface GlobalChatPageProps {
  username: string;
}

const GlobalChatPage: React.FC<GlobalChatPageProps> = ({ username }) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Global Yap</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div style={chatStyles.containerStyle1}>
              <GlobalChat username={username} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GlobalChatPage; 