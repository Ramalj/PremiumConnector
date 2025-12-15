import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const guestId = typeof window !== 'undefined' ? sessionStorage.getItem('guestId') : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (guestId) {
        config.headers['x-guest-id'] = guestId;
    }
    return config;
});

export default api;
