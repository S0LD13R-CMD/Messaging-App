import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import './App.css'
import './styles/buttonAnimations.css'
import LoginPage from './pages/LoginPage'
import GlobalChatPage from './pages/GlobalChatPage'
import PrivateChatPage from './pages/PrivateChatPage'
import { chatStyles } from './styles/chatStyles'

function App() {
  // Authentication and user states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  
  // For demo purposes only - in a real app, you would use a proper auth system
  const login = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      {isAuthenticated && (
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between py-3">
            <div className="flex space-x-4">
              <Link to="/global" className="px-3 py-2 rounded text-white font-medium">
                <button
                style={{
                  ...chatStyles.button
                }}
                className="btn-slide hover:bg-white hover:text-black"
                >
                  Global Chat
                </button>
              </Link>
              <Link to="/private" className="px-3 py-2 rounded text-white font-medium">
                <button
                style={{
                  ...chatStyles.button
                }}
                className="btn-slide hover:bg-white hover:text-black"
                >
                  Private Messages
                </button>
              </Link>
            </div>
            <div className="flex items-center p-">
              <span>Hello, {username}</span>
              <button
                onClick={logout}
                style={{
                  ...chatStyles.button
                }}
                className="btn-fade hover:bg-white hover:text-black"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/global" replace /> : 
              <LoginPage onLogin={login} />
          } 
        />
        <Route 
          path="/global" 
          element={
            isAuthenticated ? 
              <GlobalChatPage username={username} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/private" 
          element={
            isAuthenticated ? 
              <PrivateChatPage username={username} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
