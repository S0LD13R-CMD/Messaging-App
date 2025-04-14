import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/auth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(
                '/authentication/register',
                { username, password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            alert('Registration successful. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err: any) {
            alert(err?.response?.data || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                       placeholder="Password" required />
                <button type="submit">Register</button>
                <p>Already have an account? <a href="/login">Login here</a></p>
            </form>
        </div>
    );
};

export default Register;
