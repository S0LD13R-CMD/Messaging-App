import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/auth';

// Styles copied from frontend/src/styles/loginStyles.ts
// (Consider extracting to a shared file later if desired)
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
  // Use errorText style from Login component
  errorText: {
     color: '#FF6666',
     marginBottom: '1rem',
     textAlign: 'center' as const,
     fontSize: '0.9rem'
  },
  // Style for success message
  successText: {
     color: '#03DAC6', // Use teal color
     marginBottom: '1rem',
     textAlign: 'center' as const,
     fontSize: '0.9rem'
  }
};
// End of copied styles

// Keep the onRegister prop signature if it exists from App.tsx routing
const Register = ({ onRegister }: { onRegister?: () => void }) => { // Optional prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Add state from source
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Use handleSubmit from source, adapted for api instance
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setSuccess(''); // Clear success message
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Use imported api instance
            await api.post('/authentication/register', { username, password }, {
                 // If needed add headers/credentials, check api/auth.ts
                 headers: { 'Content-Type': 'application/json' },
                 withCredentials: true
            });

            setSuccess('Registration successful! Redirecting to login...');
            if(onRegister) onRegister(); // Call prop if provided

            // Redirect to login page after delay
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Keep 2s delay

        } catch (err: any) {
            console.error('Registration error:', err);
             let errorMessage = 'Registration failed. Username may already be taken.';
             // Attempt to get error message from response
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

    // Use JSX structure from source RegistrationPage.tsx
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

                    {/* Use Link component */}
                    <Link to="/login" style={loginStyles.link}>
                        Already have an account? Sign in
                    </Link>

                    {/* Styled button */}
                    <button
                        type="submit"
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
