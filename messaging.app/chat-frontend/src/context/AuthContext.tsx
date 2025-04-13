import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/auth';

type AuthContextType = {
    loggedIn: boolean;
    username: string | null;
    setLoggedIn: (status: boolean) => void;
    setUsername: (name: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        api.get('/authentication/session')
            .then(res => {
                const match = res.data.match(/username: ([^\\s]+)/);
                if (match && match[1]) {
                    setLoggedIn(true);
                    setUsername(match[1]);
                }
            })
            .catch(() => {
                setLoggedIn(false);
                setUsername(null);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, username, setLoggedIn, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
