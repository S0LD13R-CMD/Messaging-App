import React, { useState } from 'react';
import { loginStyles } from '../styles/loginStyles';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BackendRegistrationPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call your register endpoint
      await axios.post('http://localhost:8080/authentication/register', {
        username,
        password
      });
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Username may already be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.formContainer}>
        <h1 style={loginStyles.title}>Create Account</h1>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>
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
            />
          </div>
          
          <Link to="/login" style={loginStyles.link}>Already have an account? Sign in</Link>
          
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

export default BackendRegistrationPage; 