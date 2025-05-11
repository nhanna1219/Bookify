import axios from 'axios';

const API = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
    baseURL: API,
    timeout: 10000,
});

export default api;
