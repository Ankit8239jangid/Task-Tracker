import axios from 'axios';

// Create an axios instance with the correct configuration
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration or unauthorized access
    if (error.response && error.response.status === 401) {
      // You could redirect to login or dispatch a logout action here
      console.error('Unauthorized access or session expired');
    }
    return Promise.reject(error);
  }
);

export default instance;
