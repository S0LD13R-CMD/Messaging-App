import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/auth';

const UserList = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/authentication/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };
        fetchUsers();
    }, []);

    const filtered = users.filter((user: string) =>
        user.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <ul>
                {filtered.map((username: string) => (
                    <li key={username}>
                        <Link
                            to={`/private/${username}`}
                        >
                            {username}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
