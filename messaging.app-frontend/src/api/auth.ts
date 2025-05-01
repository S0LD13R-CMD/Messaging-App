import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chat.yappatron.org/api',
    // Comment out above url and uncomment below url for local running
    // baseURL: 'http://localhost:8080',
    withCredentials: true, // Include cookies for credentials on requests.
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
