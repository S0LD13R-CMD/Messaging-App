import React, { useState } from 'react';
import axios from 'axios';

const TestPage = () => {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('testuser');
    const [password, setPassword] = useState<string>('password123');

    const testApi = async () => {
        setLoading(true);
        setResult('Testing...');
        try {
            const resp = await axios.get('https://chat.yappatron.org/api/authentication/test');
            setResult(`Test successful: ${JSON.stringify(resp.data)}`);
        } catch (err: any) {
            setResult(`Test failed: ${err.message}\n${JSON.stringify(err.response?.data || {})}`);
        } finally {
            setLoading(false);
        }
    };

    const testRegisterWithAxios = async () => {
        setLoading(true);
        setResult('Testing direct Axios registration...');
        try {
            const resp = await axios.post(
                'https://chat.yappatron.org/api/authentication/register-test',
                { username, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setResult(`Registration test successful: ${JSON.stringify(resp.data)}`);
        } catch (err: any) {
            setResult(`Registration test failed: ${err.message}\n${JSON.stringify(err.response?.data || {})}`);
        } finally {
            setLoading(false);
        }
    };

    const testRegisterWithFetch = async () => {
        setLoading(true);
        setResult('Testing fetch registration...');
        try {
            const resp = await fetch('https://chat.yappatron.org/api/authentication/register-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            const data = await resp.text();
            setResult(`Fetch test: ${resp.status} ${resp.statusText}\n${data}`);
        } catch (err: any) {
            setResult(`Fetch test failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>API Test Page</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                </label>
                
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    Password:
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                </label>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testApi}
                    disabled={loading}
                    style={{ marginRight: '10px', padding: '8px 16px' }}
                >
                    Test API Connection
                </button>
                
                <button 
                    onClick={testRegisterWithAxios}
                    disabled={loading}
                    style={{ marginRight: '10px', padding: '8px 16px' }}
                >
                    Test Register (Axios)
                </button>
                
                <button 
                    onClick={testRegisterWithFetch}
                    disabled={loading}
                    style={{ padding: '8px 16px' }}
                >
                    Test Register (Fetch)
                </button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <h2>Results:</h2>
                <pre style={{ 
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '5px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}>
                    {result}
                </pre>
            </div>
        </div>
    );
};

export default TestPage; 