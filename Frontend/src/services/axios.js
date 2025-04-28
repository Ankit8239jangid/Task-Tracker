import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance with the correct configuration
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to every request
instance.interceptors.request.use(
  (config) => {
    // Get token from cookies or localStorage
    const token = Cookies.get('token');
    const tokenFromLocalStorage = localStorage.getItem('token');

    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${tokenFromLocalStorage || token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => {
    // If the response includes a token, save it to cookies
    if (response.data && response.data.token) {
      Cookies.set('token', response.data.token, {
        expires: 1, // 1 day
        secure: import.meta.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });
    }
    return response;
  },
  (error) => {
    // Handle session expiration or unauthorized access
    if (error.response && error.response.status === 401) {
      // You could redirect to login or dispatch a logout action here
      console.error('Unauthorized access or session expired');
      // Clear the token
      Cookies.remove('token');
    }
    return Promise.reject(error);
  }
);

export default instance;
