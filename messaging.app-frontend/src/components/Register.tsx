import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/auth';

const loginStyles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    fontFamily: "'Geo', sans-serif",
    color: '#FFFFFF',
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  title: {
    fontSize: '3.75rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    fontFamily: "'Geo', sans-serif",
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'white',
    marginBottom: '2rem',
  },
  form: {
    width: '100%',
    textAlign: 'left' as const,
  },
  formGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    display: 'block',
    color: 'white',
    marginBottom: '8px',
    textAlign: 'left' as const,
  },
  input: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '2px solid rgb(255, 255, 255)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  link: {
    color: 'rgb(255, 255, 255)',
    textDecoration: 'none',
    marginTop: '16px',
    display: 'block',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    width: '100%',
    transition: 'text-decoration 0.3s ease',
  },
  linkHover: {
    textDecoration: 'underline',
  },
  button: {
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'black',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '16px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'inherit',
    fontWeight: 'bold',
  },
  errorText: {
     color: '#FF6666',
     marginBottom: '1rem',
     textAlign: 'center' as const,
     fontSize: '0.9rem'
  },
  successText: {
     color: '#03DAC6',
     marginBottom: '1rem',
     textAlign: 'center' as const,
     fontSize: '0.9rem'
  }
};

const Register = ({ onRegister }: { onRegister?: () => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setSuccess('');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/authentication/register', { username, password }, {
                 headers: { 'Content-Type': 'application/json' },
                 withCredentials: true
            });

            setSuccess('Registration successful! Redirecting to login...');
            if(onRegister) onRegister();

            setTimeout(() => {
                navigate('/login');
            }, 2000); // Keeping 2s delay

        } catch (err: any) {
            console.error('Registration error:', err);
             let errorMessage = 'Registration failed. Username may already be taken.';
             if (err.response && err.response.data) {
                 if (typeof err.response.data === 'string') {
                     errorMessage = err.response.data;
                 } else if (err.response.data.message) {
                     errorMessage = err.response.data.message;
                 }
             }
             setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={loginStyles.container}>
            <div style={loginStyles.formContainer}>
                {/* Changed Title */}
                <h1 style={{...loginStyles.title, fontSize: '3.0rem'}}>Create Account</h1>

                {error && (
                    <div style={loginStyles.errorText}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={loginStyles.successText}>
                        {success}
                    </div>
                )}

                <form style={loginStyles.form} onSubmit={handleSubmit}>
                    <div style={loginStyles.formGroup}>
                        <label htmlFor="username" style={loginStyles.label}>Username:</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            style={loginStyles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div style={loginStyles.formGroup}>
                        <label htmlFor="password" style={loginStyles.label}>Password:</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            style={loginStyles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Added Confirm Password field */}
                    <div style={loginStyles.formGroup}>
                        <label htmlFor="confirmPassword" style={loginStyles.label}>Confirm Password:</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            style={loginStyles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Use Link component with hover effect */}
                    <Link 
                        to="/login" 
                        style={{
                            ...loginStyles.link,
                            ...(loginHover ? loginStyles.linkHover : {})
                        }}
                        onMouseEnter={() => setLoginHover(true)}
                        onMouseLeave={() => setLoginHover(false)}
                    >
                        Already have an account? Sign in
                    </Link>

                    {/* Styled button with animation class */}
                    <button
                        type="submit"
                        className="btn-slide"
                        style={{
                            ...loginStyles.button,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
