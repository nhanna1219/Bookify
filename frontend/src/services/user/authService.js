import axios from 'axios';

const API = import.meta.env.VITE_API_ENDPOINT;

export const registerUser = (data) => {
    return axios.post(`${API}/users/register`, data);
};

export const loginUser = (data) => {
    return axios.post(`${API}/users/login`, data)
}

export const resendVerificationEmail = (email) => {
    return axios.post(`${API}/users/resend-verification`, { email });
}

export const sendPasswordResetLink = (email) => {
    return axios.post(`${API}/users/forgot-password`, { email });
}

export const resetPassword = (data) => {
    return axios.post(`${API}/users/reset-password`, data);
}