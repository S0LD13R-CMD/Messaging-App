import React, { useState } from 'react';
import { loginStyles } from '../styles/loginStyles';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import axios from 'axios';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/authentication/login', 
        { username, password },
        { withCredentials: true }
      );

      console.log('Login successful:', response.data); 
      
      onLogin(username); 

      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please check your credentials. Perhaps you have not registered yet?';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.formContainer}>
        <h1 style={loginStyles.title}>Yappatron</h1>
        <h2 style={loginStyles.subtitle}>Unleash your inner yapper</h2>
        
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
          
          <Link to="/register" style={loginStyles.link}>Need to make account</Link>
          
          <Button
            animation="grow"
            type="submit" 
            style={{
              ...loginStyles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer' 
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 