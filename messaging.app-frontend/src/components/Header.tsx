import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
    title: string;
}

const headerStyles = {
    nav: {
        backgroundColor: '#000000',
        padding: '10px 16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        minHeight: '30px',
        position: 'relative' as const,
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: 'auto',
    },
    linkGroup: {
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
    button: {
        backgroundColor: 'transparent',
        color: '#FF6666',
        border: 'none',
        padding: '5px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '0.9rem',
        fontFamily: 'inherit',
        lineHeight: 'inherit',
        transition: 'background-color 0.2s ease, color 0.2s ease'
    },
    buttonHover: {
         backgroundColor: '#FF6666',
         color: '#000000',
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

    const getTransformedTitle = () => {
        if (title === "Global Chat") return "Global Yap";
        if (title === "Users") return "Yappers";
        if (title.startsWith("Chat with")) return title.replace("Chat with", "Yap with");
        return title;
    };

    return (
        <nav style={headerStyles.nav}>
            <div style={headerStyles.title}>{getTransformedTitle()}</div>

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
                    Global Yap
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
                    Yappers
                </Link>
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
            </div>
        </nav>
    );
};

export default Header; 