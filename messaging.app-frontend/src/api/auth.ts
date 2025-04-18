import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // We set this to our backend - Change for Abdul when necessary.
    withCredentials: true, // Include cookies for credentials on requests.
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
