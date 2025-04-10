import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/auth';

const Navbar = ({ onLogout }: { onLogout: () => void }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/authentication/logout');
        } catch {}
        onLogout();
        navigate('/login');
    };

    const recentChats: string[] = JSON.parse(localStorage.getItem('recentChats') || '[]');

    return (
        <nav style={{ marginBottom: '1rem' }}>
            <Link to="/chat" style={{ marginRight: '1rem' }}>Global Chat</Link>
            <Link to="/users" style={{ marginRight: '1rem' }}>Users</Link>
            <button onClick={handleLogout}>Logout</button>
            <div style={{ marginTop: '0.5rem' }}>
                {recentChats.map((u: string) => (
                    <div key={u}>
                        <Link to={`/private/${u}`}>🔁 {u}</Link>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
