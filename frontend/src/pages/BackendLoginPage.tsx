import React, { useState } from 'react';
import { loginStyles } from '../styles/loginStyles';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const BackendLoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Call your login endpoint
      await axios.post('/authentication/login', {
        username,
        password
      }, { withCredentials: true }); // Important for session cookies
      
      // If login is successful, call onLogin with the username
      onLogin(username);
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          setError('Invalid username or password');
        } else if (axiosError.response?.data) {
          setError(typeof axiosError.response.data === 'string' 
            ? axiosError.response.data 
            : 'Login failed. Please try again.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.formContainer}>
        <h1 style={loginStyles.title}>Backend Login</h1>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
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
            />
          </div>
          
          <Link to="/register" style={loginStyles.link}>Need to make account</Link>
          
          <button 
            type="submit" 
            style={{
              ...loginStyles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BackendLoginPage; 