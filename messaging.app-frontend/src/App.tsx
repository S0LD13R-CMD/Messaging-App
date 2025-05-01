import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GlobalChat from './components/GlobalChat';
import PrivateChat from './components/PrivateChat';
import { useAuth } from './hooks/useAuth';
import UserList from "./components/UserList";

const App = () => {
    const { loggedIn, loading } = useAuth();
    
    console.log("App component - Auth state:", { loggedIn, loading });

    if (loading) {
        return <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading session...</div>;
    }

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
            <Routes>
                {/* Force login page for all initial requests */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={
                    !loggedIn 
                    ? <Login /> 
                    : <Navigate to="/chat" replace />
                } />
                <Route path="/register" element={
                    !loggedIn
                        ? <Register />
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
                <Route path="*" element={<Navigate to={loggedIn ? "/chat" : "/login"} replace />} />
            </Routes>
        </div>
    );
};

export default App;
