import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.yappatron.org', // Point to the public backend URL with /api prefix
    withCredentials: true, // Include cookies for credentials on requests.
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
