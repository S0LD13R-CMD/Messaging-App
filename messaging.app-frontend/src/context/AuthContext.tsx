import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/auth';

// Export the type
export type AuthContextType = {
    loggedIn: boolean;
    username: string | null;
    loading: boolean;
    loginLoading: boolean;
    loginError: string | null;
    setLoggedIn: (status: boolean) => void;
    setUsername: (name: string | null) => void;
    logout: () => Promise<void>;
    login: (user: string, pass: string) => Promise<void>;
    clearLoginError: () => void;
};

// Export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    console.log('AuthProvider initialized with', { loggedIn, loading });

    const logout = async () => {
        console.log('Logout called');
        try {
            await api.post('/authentication/logout');
            console.log('Logout API call successful');
        } catch (err) {
            console.error('Logout API call error:', err);
        } finally {
            setLoggedIn(false);
            setUsername(null);
            console.log('Client-side state updated for logout.');
        }
    };

    const login = async (user: string, pass: string): Promise<void> => {
        console.log('AuthContext login called for:', user);
        setLoginLoading(true);
        setLoginError(null);
        try {
            await api.post('/authentication/login', { username: user, password: pass }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setLoggedIn(true);
            setUsername(user);
            setLoginError(null);
            console.log('AuthContext login successful, state updated.');
            return Promise.resolve();
        } catch (err: any) {
            console.error('AuthContext login error:', err);
            let errorMessage = 'Login failed. Invalid credentials or server error.';
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string' && err.response.data.length < 100) {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            }
            setLoggedIn(false);
            setUsername(null);
            setLoginError(errorMessage);
            return Promise.reject(new Error(errorMessage));
        } finally {
            setLoginLoading(false);
        }
    };

    const clearLoginError = () => {
        setLoginError(null);
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
        <AuthContext.Provider value={{
            loggedIn, username, loading,
            loginLoading, loginError,
            setLoggedIn, setUsername, logout,
            login,
            clearLoginError
        }}>
            {children}
        </AuthContext.Provider>
    );
};
