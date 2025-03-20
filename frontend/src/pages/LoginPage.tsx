import React, { useState } from 'react';
import { loginStyles } from '../styles/loginStyles';

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
          
          <a href="#" style={loginStyles.link}>Need to make account</a>
          
          <button 
            type="submit" 
            style={loginStyles.button}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 