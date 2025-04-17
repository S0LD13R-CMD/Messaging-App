import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    title: string;
}

const headerStyles = {
    nav: {
        backgroundColor: '#000000', // Changed to black
        padding: '10px 16px',        // Padding from previous header
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFFFFF',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: 'auto', // Push links/button to the right
    },
    link: {
        color: '#FFFFFF',
        textDecoration: 'none',
        margin: '0 10px', // Spacing between links/button
        padding: '5px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease'
    },
    // Basic hover effect for links
    linkHover: {
         backgroundColor: '#333333',
    },
    button: {
        backgroundColor: '#BB86FC', // Purple button
        color: 'black',
        border: 'none',
        padding: '5px 15px', // Slightly smaller padding
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '0.9rem'
    }
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login'); // Navigate after logout state is updated
    };

    return (
        <nav style={headerStyles.nav}>
            <div style={headerStyles.title}>{title}</div>
            <div>
                <Link 
                    to="/chat" 
                    style={{ 
                        ...headerStyles.link, 
                        ...(hoveredLink === 'global' ? headerStyles.linkHover : {}) 
                    }}
                    onMouseEnter={() => setHoveredLink('global')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Global Chat
                </Link>
                <Link 
                    to="/users" 
                    style={{ 
                        ...headerStyles.link, 
                        ...(hoveredLink === 'users' ? headerStyles.linkHover : {}) 
                    }}
                    onMouseEnter={() => setHoveredLink('users')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Users
                </Link>
                <button onClick={handleLogout} style={headerStyles.button}>Logout</button>
            </div>
        </nav>
    );
};

export default Header; 