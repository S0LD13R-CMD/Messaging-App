import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
  }
};

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerHover, setRegisterHover] = useState(false);
    const { login, loginLoading, loginError, clearLoginError } = useAuth();

    useEffect(() => {
        if(loginError && clearLoginError) {
           clearLoginError();
        }
    }, [username, password, loginError, clearLoginError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(username, password);
            console.log('Login component: Context login resolved.');
        } catch (err: any) {
            console.error('Login component: Context login rejected:', err.message);
        }
    };

    return (
        <div style={loginStyles.container}>
            <div style={loginStyles.formContainer}>
                <h1 style={loginStyles.title}>Yappatron</h1>
                <h2 style={loginStyles.subtitle}>Unleash your inner yapper</h2>

                {loginError && (
                    <div style={loginStyles.errorText}>
                        {loginError}
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
                            disabled={loginLoading}
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
                            disabled={loginLoading}
                        />
                    </div>

                    <Link 
                        to="/register" 
                        style={{
                            ...loginStyles.link,
                            ...(registerHover ? loginStyles.linkHover : {})
                        }}
                        onMouseEnter={() => setRegisterHover(true)}
                        onMouseLeave={() => setRegisterHover(false)}
                    >
                        No Account? No Problem. Sign up now!
                    </Link>

                    <button
                        type="submit"
                        className="btn-slide"
                        style={{
                            ...loginStyles.button,
                            opacity: loginLoading ? 0.7 : 1,
                            cursor: loginLoading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={loginLoading}
                    >
                        {loginLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;