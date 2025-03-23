import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import './App.css'
import './styles/buttonAnimations.css'
import LoginPage from './pages/LoginPage'
import BackendRegistrationPage from './pages/RegistrationPage'
import GlobalChatPage from './pages/GlobalChatPage'
import PrivateChatPage from './pages/PrivateChatPage'
import { chatStyles } from './styles/chatStyles'
import SearchPopup from './components/ui/SearchPopup'
import ErrorPopup from './components/ui/ErrorPopup'

function App() {
  // Authentication and user states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [hasUnreadPrivate, setHasUnreadPrivate] = useState(false);
  const [searchedUser, setSearchedUser] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Error popup state
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  
  // For demo purposes only - in a real app, you would use a proper auth system
  const login = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  // Clear notifications when visiting private messages page
  const clearPrivateNotifications = () => {
    setHasUnreadPrivate(false);
  };

  // Mock user search function - in a real app, this would query the database
  const searchUser = (searchUsername: string) => {
    // Hard-coded demo users for testing
    const demoUsers = ['Alice', 'Bob', 'Charlie', 'Mahir', 'Saad', 'Martin'];
    
    if (demoUsers.map(name => name.toLowerCase()).includes(searchUsername.toLowerCase())) {
      // Navigate to private messages and pass the searched user
      setSearchedUser(searchUsername);
      setIsSearchOpen(false);
      return true;
    } else {
      // Show custom error popup instead of alert
      setErrorMessage(`User "${searchUsername}" not found.`);
      setIsErrorOpen(true);
      return false;
    }
  };

  const closeErrorPopup = () => {
    setIsErrorOpen(false);
  };

  return (
    <Router>
      {isAuthenticated && (
        <nav className="text-white p-4 pb-8 mb-8">
          <div className="max-w-screen-2xl mx-auto flex justify-between">
            <div className="flex">
              <Link to="/global" className="rounded text-white font-medium">
                <button
                style={{...chatStyles.button}}
                className="btn-slide hover:bg-white hover:text-black"
                >
                  Global Chat
                </button>
              </Link>
              <Link to="/private" className="rounded text-white font-medium" onClick={clearPrivateNotifications}>
                <button
                style={{
                  ...chatStyles.button,
                  backgroundColor: hasUnreadPrivate ? 'rgba(220, 38, 38, 0.8)' : 'black'
                }}
                className="btn-slide hover:bg-white hover:text-black"
                >
                  Private Messages
                </button>
              </Link>
            </div>
            <div className="flex items-center p-">
              <span className="mr-4">Hello, {username}</span>
              <button
                onClick={() => setIsSearchOpen(true)}
                style={{...chatStyles.button}}
                className="btn-fade hover:bg-white hover:text-black mr-2"
              >
                Search User
              </button>
              <button
                onClick={logout}
                style={{...chatStyles.button}}
                className="btn-fade hover:bg-white hover:text-black"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Search popup */}
      <SearchPopup 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onSearch={searchUser}
      />
      
      {/* Error popup */}
      <ErrorPopup
        isOpen={isErrorOpen}
        onClose={closeErrorPopup}
        message={errorMessage}
      />
      
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
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/global" replace /> : 
              <BackendRegistrationPage />
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
              <PrivateChatPage 
                username={username} 
                onNewMessage={() => setHasUnreadPrivate(true)}
                clearNotifications={clearPrivateNotifications}
                searchedUser={searchedUser}
                onUserSelected={() => setSearchedUser(null)}
              /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
