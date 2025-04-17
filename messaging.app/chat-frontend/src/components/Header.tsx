import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    title: string;
}

const headerStyles = {
    nav: {
        backgroundColor: '#000000', // Black background
        padding: '10px 16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Push items to ends
        color: '#FFFFFF',
        minHeight: '30px',
        position: 'relative' as const, // Added 'as const'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        position: 'absolute' as const, // Added 'as const'
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)', // Center trick
        // No flexGrow or textAlign needed
    },
    linkGroup: { // Div for links to keep them grouped
        display: 'flex',
        alignItems: 'center',
    },
    link: {
        color: '#FFFFFF',
        textDecoration: 'none',
        margin: '0 10px',
        padding: '5px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
        fontSize: '0.9rem',
    },
    linkHover: {
         backgroundColor: '#333333',
    },
    // Corrected Logout Button Style
    button: {
        backgroundColor: 'transparent',
        color: '#FF6666', // Red text color
        border: 'none', // No border initially
        padding: '5px 8px', // Explicitly match link padding
        borderRadius: '4px', // Match link radius
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '0.9rem', // Match link font size
        fontFamily: 'inherit', // Ensure font matches rest of header
        lineHeight: 'inherit', // Ensure vertical alignment matches links
        transition: 'background-color 0.2s ease, color 0.2s ease'
    },
    buttonHover: {
         backgroundColor: '#FF6666', // Red background on hover
         color: '#000000', // Black text on hover
    }
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [logoutHover, setLogoutHover] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={headerStyles.nav}>
            {/* Link Group on Left */}
            <div style={headerStyles.linkGroup}>
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
            </div>

            {/* Absolutely Centered Title */}
            <div style={headerStyles.title}>{title}</div>

            {/* Logout Button on Right (no extra div needed with space-between) */}
            <button
                onClick={handleLogout}
                style={{
                    ...headerStyles.button,
                    ...(logoutHover ? headerStyles.buttonHover : {})
                }}
                onMouseEnter={() => setLogoutHover(true)}
                onMouseLeave={() => setLogoutHover(false)}
            >
                Logout
            </button>
        </nav>
    );
};

export default Header; 