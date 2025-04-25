import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://chat.yappatron.org/api',
    // below url is necessary for local running
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Include cookies for credentials on requests.
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
