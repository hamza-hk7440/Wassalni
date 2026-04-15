import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid/expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to login only if not already on the login/auth pages
            if (window.location.pathname !== '/auth/login') {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
