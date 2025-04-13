import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GlobalChat from './components/GlobalChat';
import PrivateChat from './components/PrivateChat';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import UserList from "./components/UserList";
import WebSocketEchoTester from "./components/WebSocketEchoTester";

const App = () => {
    const { loggedIn, setLoggedIn, loading } = useAuth();
    
    console.log("App component - Auth state:", { loggedIn, loading });

    if (loading) {
        return <div>Loading session...</div>;
    }

    return (
        <div>
            {loggedIn && <Navbar onLogout={() => setLoggedIn(false)} />}
            <Routes>
                {/* Force login page for all initial requests */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={
                    !loggedIn 
                    ? <Login onLogin={() => setLoggedIn(true)} /> 
                    : <Navigate to="/chat" replace />
                } />
                <Route path="/register" element={
                    !loggedIn 
                    ? <Register onRegister={() => setLoggedIn(true)} /> 
                    : <Navigate to="/chat" replace />
                } />
                <Route path="/chat" element={
                    loggedIn 
                    ? <GlobalChat /> 
                    : <Navigate to="/login" replace />
                } />
                <Route path="/private/:receiverId" element={
                    loggedIn 
                    ? <PrivateChat /> 
                    : <Navigate to="/login" replace />
                } />
                <Route path="/users" element={
                    loggedIn 
                    ? <UserList /> 
                    : <Navigate to="/login" replace />
                } />
                <Route path="/ws-test" element={
                    loggedIn 
                    ? <WebSocketEchoTester /> 
                    : <Navigate to="/login" replace />
                } />
                <Route path="*" element={<Navigate to={loggedIn ? "/chat" : "/login"} replace />} />
            </Routes>
        </div>
    );
};

export default App;
