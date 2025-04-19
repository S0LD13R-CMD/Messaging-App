import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/auth';
import Header from './Header'; // Import the Header

// Basic styles similar to chat components
const userListStyles = {
    container: {
        border: '2px solid #666666',
        borderRadius: '24px',
        overflowY: 'auto' as const,
        backgroundColor: 'transparent',
        width: '100%',
        padding: '20px',
        color: '#FFFFFF',
        boxShadow: '0 4px 6px rgb(30, 30, 30)',
        display: 'flex',
        flexDirection: 'column' as const,
        flexGrow: 1,
    },
    searchInput: {
        width: '100%',
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #666666',
        borderRadius: '12px',
        color: 'white',
        outline: 'none',
        marginBottom: '20px',
        boxSizing: 'border-box' as const,
        fontFamily: 'inherit',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        columnCount: 3,
        columnGap: '20px',
        height: '100%',
        overflowY: 'auto' as const,
        flexGrow: 1,
    },
    listItem: {
        padding: '8px 0',
        borderBottom: '1px solid #666666',
        breakInside: 'avoid' as const,
    },
    link: {
        color: '#FFFFFF',
        textDecoration: 'none',
        fontSize: '1.0rem',
        display: 'block',
        transition: 'color 0.2s ease',
    },
    linkHover: {
        color: '#BB86FC',
    },
    noUsersText: {
        color: '#aaaaaa',
        padding: '10px 0',
        textAlign: 'center' as const,
    }
};

const UserList = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [hoveredUser, setHoveredUser] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/authentication/users');
                setUsers(res.data.sort((a: string, b: string) => a.localeCompare(b)));
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user: string) =>
        user.toLowerCase().includes(search.toLowerCase())
    );

    return (
        // Outer wrapper
        <div style={{ 
            backgroundColor: '#000000', 
            color: '#FFFFFF', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden' // Prevent outer scrollbar
        }}>
            <Header title="Users" />

            {/* Centering div - ADD flexGrow: 1 and display: flex */}
            <div style={{ 
                maxWidth: '1280px', 
                width: '95%', 
                margin: '0 auto', 
                padding: '0 10px', 
                flexGrow: 1, 
                display: 'flex',
                overflow: 'hidden' // Ensure no horizontal scrollbar
            }}>
                {/* Styled container - Uses flexGrow now */}
                <div style={{
                    ...userListStyles.container,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={userListStyles.searchInput}
                    />
                    <ul style={{
                        ...userListStyles.list,
                        overflowY: 'auto', // Always use scrollbar in container
                        flexGrow: 1
                    }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((username: string) => (
                                <li key={username} style={userListStyles.listItem}>
                                    <Link
                                        to={`/private/${username}`}
                                        style={{
                                            ...userListStyles.link,
                                            ...(hoveredUser === username ? userListStyles.linkHover : {})
                                        }}
                                        onMouseEnter={() => setHoveredUser(username)}
                                        onMouseLeave={() => setHoveredUser(null)}
                                    >
                                        {username}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li style={userListStyles.noUsersText}>No users found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserList;
