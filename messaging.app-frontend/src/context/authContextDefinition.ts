import { createContext } from 'react';

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
 
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 