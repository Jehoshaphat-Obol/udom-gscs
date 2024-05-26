// src/axiosInstance.js

import axios from 'axios';
import authService from './services/authService';

const axiosInstance = axios.create({
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const user = authService.getCurrentUser();
        if (user && user.access) {
            config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await authService.refreshToken();
            if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
