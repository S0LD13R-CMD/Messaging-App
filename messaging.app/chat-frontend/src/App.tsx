import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GlobalChat from './components/GlobalChat';
import PrivateChat from './components/PrivateChat';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import api from './api/auth';
import UserList from "./components/UserList";
import WebSocketEchoTester from "./components/WebSocketEchoTester";

const App = () => {
    const { loggedIn, setLoggedIn } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/authentication/session')
            .then(res => {
                if (res.data.includes('username')) {
                    setLoggedIn(true);
                }
            })
            .catch(() => setLoggedIn(false))
            .finally(() => setLoading(false));
    }, [setLoggedIn]);

    if (loading) return <div>Loading session...</div>;

    return (
        <div>
            {loggedIn && <Navbar onLogout={() => setLoggedIn(false)} />}
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={!loggedIn ? <Login onLogin={() => setLoggedIn(true)} /> : <Navigate to="/chat" />} />
                <Route path="/register" element={!loggedIn ? <Register onRegister={() => setLoggedIn(true)} /> : <Navigate to="/chat" />} />
                <Route path="/chat" element={loggedIn ? <GlobalChat /> : <Navigate to="/login" />} />
                <Route path="/private/:receiverId" element={loggedIn ? <PrivateChat /> : <Navigate to="/login" />} />
                <Route path="/users" element={loggedIn ? <UserList /> : <Navigate to="/login" />} />
                <Route path="/ws-test" element={loggedIn ? <WebSocketEchoTester /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

export default App;
