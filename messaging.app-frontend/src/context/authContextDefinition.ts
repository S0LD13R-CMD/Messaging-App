import { createContext } from 'react';

// Define and export the type for the context value
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

// Create and export the context itself
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 