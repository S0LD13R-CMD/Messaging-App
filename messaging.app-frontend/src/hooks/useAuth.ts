import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/authContextDefinition'; 

// Define and export the hook from its own file
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    // Make sure context is not undefined when accessed
    if (context === undefined) { 
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
