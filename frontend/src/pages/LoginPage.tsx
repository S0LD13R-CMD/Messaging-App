import React, { useState } from 'react';
import { loginStyles } from '../styles/loginStyles';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle login logic
    console.log('Login attempt with:', { username, password });
    // Call the onLogin function to update the authentication state with username
    onLogin(username);
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.formContainer}>
        <h1 style={loginStyles.title}>Yappatron</h1>
        <h2 style={loginStyles.subtitle}>Unleash your inner yapper</h2>
        
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
          
          <Button
            animation="grow"
            type="submit" 
            style={loginStyles.button}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 