import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/auth';

type AuthContextType = {
    loggedIn: boolean;
    username: string | null;
    loading: boolean;
    setLoggedIn: (status: boolean) => void;
    setUsername: (name: string | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('AuthProvider initialized with', { loggedIn, loading });

    const logout = async () => {
        console.log('Logout called');
        try {
            await api.post('/authentication/logout');
            console.log('Logout API call successful');
        } catch (err) {
            console.error('Logout API call error:', err);
            // Decide if we should still log out client-side even if API fails
        } finally {
             // Always update client-side state regardless of API success/failure for immediate UI feedback
            setLoggedIn(false);
            setUsername(null);
            // Navigation should happen where logout is called (e.g., in the header button's onClick)
            // Or potentially here if it should always redirect
             console.log('Client-side state updated for logout.');
        }
    };

    useEffect(() => {
        console.log('AuthProvider useEffect running');
        setLoading(true);
        setLoggedIn(false);
        
        api.get('/authentication/session')
            .then(res => {
                console.log('Session response:', res.data);
                const match = res.data.match(/username:\s+([^"null"][\w-]+)/);
                if (match && match[1] && match[1] !== "null") {
                    console.log('Found username:', match[1]);
                    setLoggedIn(true);
                    setUsername(match[1]);
                } else {
                    console.log('No username found in session or username is null');
                    setLoggedIn(false);
                    setUsername(null);
                }
            })
            .catch(err => {
                console.error('Session check error:', err);
                setLoggedIn(false);
                setUsername(null);
            })
            .finally(() => {
                console.log('Session check completed, setting loading to false');
                setLoading(false);
            });
    }, []);

    console.log('AuthProvider current state:', { loggedIn, username, loading });

    return (
        <AuthContext.Provider value={{ loggedIn, username, loading, setLoggedIn, setUsername, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
